// -------------------------------- || Shree Ram || -----------------------------------

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

export default class Generic_Record_Page extends LightningElement {

     @track ObjectValue = 'Select Object';
     @track showDataTable = false
     @track columns = [];
     @track Spinner = false;

     @track pageSizeOptions = [50, 75, 100];
     @track records = [];
     @track sizeOfRecords;
     @track pageSize;
     @track totalPages = 1;
     @track pageNumber = 1;
     @track recordsToDisplay = [];

     get GetObjectoptions() {
          return [
               { label: 'Account', value: 'account' },
               { label: 'Contact', value: 'contact' },
               { label: 'Opportunity', value: 'opportunity' },
          ];
     }
     get bDisableFirst() {
          return this.pageNumber == 1;
     }
     get bDisableLast() {
          return this.pageNumber == this.totalPages;
     }

     ObjectChanges(event) 
     {
          this.ObjectValue = event.detail.value;
          console.log('Object ', this.ObjectValue);
          this.pageNumber = 1;
          this.totalPages = 0;
          
          if (this.ObjectValue == 'account') {
               this.columns = AccountColumns;
               this.showDataTable = true;
               this.records = [];
               this.recordsToDisplay = [];
               this.getAccountRecord();
          }
          else if (this.ObjectValue == 'contact') {
               this.columns = Contactcolumns;
               this.showDataTable = true;
               this.records = [];
               this.recordsToDisplay = [];
               this.getContactRecord();
          }
          else if (this.ObjectValue == 'opportunity') {
               this.columns = Opportunitycolums;
               this.showDataTable = true;
               this.records = [];
               this.recordsToDisplay = [];
               this.getOpportunityRecord();
          }
     }

     getAccountRecord() 
     {
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
                    this.pageSize = this.pageSizeOptions[0];
                    this.sizeOfRecords = result.length;
                    this.Spinner = false;
                    this.paginationHelper();
               })
               .catch((error) => {
                    console.log('Account Error ', error);
               })
     }
     getContactRecord() {
          this.Spinner = true;
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
                    this.pageSize = this.pageSizeOptions[0];
                    this.sizeOfRecords = result.length;
                    this.Spinner = false;
                    this.paginationHelper();
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
                    this.pageSize = this.pageSizeOptions[0];
                    this.sizeOfRecords = result.length;
                    this.Spinner = false;
                    this.paginationHelper();
               })
               .catch((error) => {
                    console.log('Opportunity Error ', error);
               })
     }
     previousPage() {
          this.pageNumber = this.pageNumber - 1;
          this.paginationHelper();
     }
     nextPage() {
          this.pageNumber = this.pageNumber + 1;
          this.paginationHelper();
     }
     
     paginationHelper() 
     {
          this.recordsToDisplay = [];
          this.totalPages = Math.ceil(this.sizeOfRecords / this.pageSize);
          // set page number 
          if (this.pageNumber <= 1) {
               this.pageNumber = 1;
          } else if (this.pageNumber >= this.totalPages) 
          {
               this.pageNumber = this.totalPages;
          }
          // set records to display on current page 
          for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
               if (i === this.sizeOfRecords) {
                    break;
               }
               this.recordsToDisplay.push(this.records[i]);
          }
     }
}