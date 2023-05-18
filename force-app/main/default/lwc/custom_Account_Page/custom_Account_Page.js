import { LightningElement, track } from 'lwc';
import GetAccounts from '@salesforce/apex/Custom_Account_Apex.GetAccount'
import { NavigationMixin } from 'lightning/navigation';
import GetUserDomainName from '@salesforce/apex/Custom_Account_Apex.GetUserDomainName';
import GetContacts from '@salesforce/apex/Custom_Account_Apex.GetRelatedContacts';
import GetOpportunity from '@salesforce/apex/Custom_Account_Apex.GetRelatedOpportunity';
import GetBySearch from '@salesforce/apex/Custom_Account_Apex.GetBySearch';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


// Columns --> 

const columns = 
[
    {
        label: 'Account Name', fieldName: 'AccUrl', type: 'url', sortable: true,
        typeAttributes: { label: { fieldName: 'Name' }, target: '_blank' }
    },
    {
        type: "text",
        fieldName: "Phone",
        label: "Phone"
    },
    {
        type: "text",
        fieldName: "NumberOfEmployees",
        label: "Employees"
    },
    { 
        type: 'button-icon',
        label: "Edit",
        initialWidth: 75,
        typeAttributes: 
        { 
            iconName:'action:edit',
            name:'edit',
            variant: 'border-filled',
        } 
    },
    { 
        type: 'button-icon',
        label: "Preview",
        initialWidth: 75, 
        typeAttributes: 
        { 
            iconName:'action:preview',
            name:'preview',
            variant: 'border-filled',
        } 
    },
    { 
        type: 'button-icon',
        label: "Delete",
        initialWidth: 75,
        typeAttributes: 
        { 
            iconName:'action:delete',
            name:'delete', 
            iconClass: 'slds-icon-text-error',
            variant: 'border-filled',
        } 
    },
];

export default class Custom_Account_Page extends NavigationMixin(LightningElement)
{

    // Attributes ----------------------------->>>>


    @track TotalAccount
    @track columns
    @track accounts = []
    @track UserDomainUrl
    @track AccUrl
    @track ConUrl
    @track OppUrl
    @track columns = columns
    @track relatedRecords = false
    @track AccountContacts = []
    @track AccountOpportunity = []
    @track DeleteConformation = false
    @track copy = []
    @track Scroller = false
    @track count = 50
    @track recordId


    // Get Records ------------------------------> 

    connectedCallback() {
        GetUserDomainName()
            .then((result) => {
                this.UserDomainUrl = result;

                var url = 'https://' + this.UserDomainUrl
                this.UserDomainUrl = url
                console.log('Dynamic Url ', this.UserDomainUrl);
            })
            .catch((error) => {
                console.log(error);
            })

        GetAccounts()
            .then((result) => {
                console.log('Account get ', result);
                this.accounts = result

                for (var i = 0; i < this.accounts.length; i++) 
                {

                    this.accounts[i].AccUrl = this.UserDomainUrl + '/lightning/r/Account/' + this.accounts[i].Id + '/view';
                }
                this.copy = this.accounts;
                this.accounts = [...this.copy].splice(0,50);
                this.TotalAccount = this.accounts.length+'+';
            })
            .catch((error) => {
                console.log(error);
            })
    }
    handleNotification(evt) 
    {
        let value1 = evt.target.scrollHeight;
        let value2 = evt.target.scrollTop;
        let value3 = Math.round(value1) - Math.round(value2);
        console.log('value1 ',value1, ' value2 ',value2, ' value3 ',value3);

        if(value3 === evt.target.clientHeight)
        {
            this.count += 50;
            this.Scroller = true;
            setTimeout(() => {
                this.Scroller = false 
                this.accounts = [...this.copy].splice(0,this.count); 
                if(this.accounts.length < this.copy.length)
                {
                    this.TotalAccount = this.accounts.length+'+';   
                }
                else
                {
                    this.TotalAccount = this.accounts.length;   
                }
            },500);
        }
    }

    // Action Button --------------------------->>>>

    callRowAction(event) 
    {
        const actionName = event.detail.action.name;
        console.log();

        const row = event.detail.row;

        switch (actionName) 
        {
            case 'edit':
                this[NavigationMixin.Navigate]
                    ({
                        type: 'standard__recordPage',
                        attributes:
                        {
                            recordId: row.Id,
                            objectApiName: 'Account',
                            actionName: 'edit',
                        }
                    });
                break;
            case 'delete':

                this.DeleteConformation = true
                this.recordId = row.Id;
                break;
            case 'preview':

                this.relatedRecords = true
                this.GetRelated(row.Id);
                break;
            default:
        }
    }


    // Related Records ------------------------------->>> 

    @track ContactColumns =
        [
            {
                label: 'Contact Name', fieldName: 'ConUrl', type: 'url', sortable: true,
                typeAttributes: { label: { fieldName: 'Name' }, target: '_blank' }
            },
            {
                type: "text",
                fieldName: "Email",
                label: "Email"
            },
            {
                type: "text",
                fieldName: "Phone",
                label: "Phone"
            }
        ]
    @track OpportunityColumns = [

        {
            label: 'Opportunity Name', fieldName: 'OppUrl', type: 'url', sortable: true,
            typeAttributes: { label: { fieldName: 'Name' }, target: '_blank' }
        },
        {
            type: "text",
            fieldName: "Amount",
            label: "Amount"
        },
        {
            type: "text",
            fieldName: "StageName",
            label: "Stage Name"
        }
    ]


    // Get Related Records (Modal) ------------------->>>>>>>>>>>>>>> 

    GetRelated(rowId) {
        console.log('Row Id ', rowId);

        GetContacts({ accId: rowId })
            .then((result) => {
                console.log('Contacts ', result);
                this.AccountContacts = result
                for (var i = 0; i < this.AccountContacts.length; i++) {

                    this.AccountContacts[i].ConUrl = this.UserDomainUrl + '/lightning/r/Contact/' + this.AccountContacts[i].Id + '/view';
                }
            })
            .catch((error) => {
                console.log(error);
            })
        GetOpportunity({ accId: rowId })
            .then((result) => {
                console.log('Opportunity ', result);
                this.AccountOpportunity = result;
                for (var i = 0; i < this.AccountOpportunity.length; i++) {

                    this.AccountOpportunity[i].OppUrl = this.UserDomainUrl + '/lightning/r/Opportunity/' + this.AccountOpportunity[i].Id + '/view';
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    // Delete Conformation Modal ----------------->>>>>> 

    deleteAction() 
    {
        console.log('delete',this.recordId);
        deleteRecord(this.recordId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
                this.updateRecordView();
                GetAccounts()
                    .then((result) => {
                        console.log('Account get ', result);
                        this.TotalAccount = result.length;
                        this.accounts = result

                        for (var i = 0; i < this.accounts.length; i++) {

                            this.accounts[i].AccUrl = this.UserDomainUrl + '/lightning/r/Account/' + this.accounts[i].Id + '/view';
                        }
                        this.copy = this.accounts;
                        this.accounts = [...this.copy].splice(0,50);
                        this.TotalAccount = this.accounts.length+'+';
                        this.DeleteConformation = false;
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            })
    }

    // Search by Name 

    search(event)
    {
        var text = this.template.querySelector(".SearchValue").value;
        

        if(event.key=='Enter')
        {
            GetBySearch({value:text})
            .then((result) => {
                console.log('Account get ', result);
                this.TotalAccount = result.length;
                this.accounts = result

                for (var i = 0; i < this.accounts.length; i++) {

                    this.accounts[i].AccUrl = this.UserDomainUrl + '/lightning/r/Account/' + this.accounts[i].Id + '/view';
                }
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }
    closeModal() {
        if (this.DeleteConformation == true) {
            this.DeleteConformation = false;
        }
        if (this.relatedRecords == true) {
            this.relatedRecords = false
        }
    }

    updateRecordView() {
        eval("$A.get('e.force:refreshView').fire();");
    }
}