import { LightningElement, api, track, wire } from 'lwc';
import { getRecordUi } from 'lightning/uiRecordApi';

export default class Cmp extends LightningElement {

    @wire(getRecordUi, { recordIds: '0035g00000usXc7AAE', layoutTypes: 'view' })
    propertyOrFunction;

    @api columns;
    @api records = [];
    @api pageSize = 0;
    show = false
    @track showDataTable = false
    // @track pageSizeOptions = [50, 75, 100];
    @track sizeOfRecords;
    @track totalPages = 1;
    @track pageNumber = 1;
    @track recordsToDisplay = [];

    connectedCallback() {
        console.log('GitHub');
        console.log(this.records, ' -- ', this.columns);
        this.showDataTable = true;
        // this.pageSize = this.pageSizeOptions[0];
        this.sizeOfRecords = this.records.length;
        this.pageNumber = 1;
        this.paginationHelper();
    }
    get bDisableFirst() {
        return this.pageNumber == 1;
    }
    get bDisableLast() {
        return this.pageNumber == this.totalPages;
    }
    previousPage() {
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    paginationHelper() {
        this.recordsToDisplay = [];
        this.totalPages = Math.ceil(this.sizeOfRecords / this.pageSize);
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.sizeOfRecords) {
                break;
            }
            this.recordsToDisplay.push(this.records[i]);
        }
    }
}