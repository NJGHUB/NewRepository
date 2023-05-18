import { LightningElement, track, wire } from 'lwc';
import getAccountList from '@salesforce/apex/GenericRecordPageApex.getAccountList';
import getContactList from '@salesforce/apex/GenericRecordPageApex.getContactList';
import getOpportunityList from '@salesforce/apex/GenericRecordPageApex.getOpportunityList';


const AccountColumns = [
    { label: 'Name', fieldName: 'Name', sortable: true }, 
    { label: 'Number Of Employees', fieldName: 'NumberOfEmployees', sortable: true },
    { label: 'Phone', fieldName: 'Phone', sortable: true },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', sortable: true },
    { label: 'Owner', fieldName: 'Owner', sortable: true },
];

const Contactcolumns = [
    { label: 'First Name', fieldName: 'FirstName', sortable: true },
    { label: 'Last Name', fieldName: 'LastName', sortable: true },
    { label: 'Account', fieldName: 'AccountName', sortable: true },
    { label: 'Phone', fieldName: 'Phone', sortable: true },
    { label: 'Email', fieldName: 'Email', sortable: true }
];

const Opportunitycolums = [
    { label: 'Name', fieldName: 'Name', sortable: true },
    { label: 'Created Date', fieldName: 'CreatedDate', sortable: true },
    { label: 'Amount', fieldName: 'Amount', sortable: true },
    { label: 'Stage Name', fieldName: 'StageName', sortable: true },
    { label: 'Account', fieldName: 'AccountName', sortable: true },
];


export default class GenericParentPage extends LightningElement {

    @track ObjectValue = 'Select Object';
    records = [];
    columns;
    @track checkCall = false;
    @track Spinner = false;

    get GetObjectoptions() {
        return [
            { label: 'Account', value: 'account' },
            { label: 'Contact', value: 'contact' },
            { label: 'Opportunity', value: 'opportunity' },
        ];
    }
    ObjectChanges(event) 
    {
        this.ObjectValue = event.detail.value;
        console.log('Object ', this.ObjectValue);
        this.checkCall = false;

        if (this.ObjectValue == 'account') 
        {
            this.columns = AccountColumns;
            this.getAccountRecord();
        }
        else if (this.ObjectValue == 'contact') {
            this.columns = Contactcolumns;
            this.getContactRecord();
        }
        else if (this.ObjectValue == 'opportunity') {
            this.columns = Opportunitycolums;
            this.getOpportunityRecord();
        }
    }
    getAccountRecord() 
    {
        console.log('acc')
        this.Spinner = true;
        getAccountList()
            .then((result) => {
                console.log('Account Result ', result);
                this.sizeOfRecords = result.length;
                
                let currentData = [];
                result.forEach((row) => {
                    let rowData = {};
                    rowData.Name = row.Name;
                    rowData.Phone = row.Phone;
                    rowData.NumberOfEmployees = row.NumberOfEmployees;
                    rowData.AnnualRevenue = row.AnnualRevenue;
                    rowData.Owner = row.Owner.Name;
                    if (row.Owner) {

                    }
                    currentData.push(rowData);
                });
                this.records = currentData;
                this.checkCall = true;
                this.Spinner = false;
            })
            .catch((error) => {
                console.log('Account Error ', error);
            })
    }
    getContactRecord() {
        this.Spinner = true;
        console.log('Hello GitHub');
        getContactList()
            .then((result) => {
                console.log('Contact Result ', result);

                let currentData = [];
                result.forEach((row) => {
                    let rowData = {};
                    rowData.FirstName = row.FirstName;
                    rowData.LastName = row.LastName;
                    if (row.Account) {
                        rowData.AccountName = row.Account.Name;
                    }
                    rowData.Phone = row.Phone;
                    rowData.Email = row.Email;
                    currentData.push(rowData);
                });
                this.records = currentData;
                this.checkCall = true;
                this.Spinner = false;
            })
            .catch((error) => {
                console.log('Contact Error ', error);
            })
    }
    getOpportunityRecord() {
        this.Spinner = true;
        getOpportunityList()
            .then((result) => {
                console.log('Opportunity Result ', result);
                this.sizeOfRecords = result.length;
                let currentData = [];
                result.forEach((row) => {
                    let rowData = {};
                    rowData.Name = row.Name;
                    rowData.CreatedDate = row.CreatedDate;
                    if (row.Account) {
                        rowData.AccountName = row.Account.Name;
                    }
                    rowData.StageName = row.StageName;
                    rowData.Amount = row.Amount;
                    currentData.push(rowData);
                });
                this.records = currentData;
                this.checkCall = true;
                this.Spinner = false;
            })
            .catch((error) => {
                console.log('Opportunity Error ', error);
            })
    }
}