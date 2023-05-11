@isTest
public class GenericRecordPageApexTest 
{	
    @isTest
    public Static void getAccountListTest()
    {
        List<Account> accList = GenericRecordPageApex.getAccountList();
        System.debug('Account '+accList);
    }
    @isTest
    public Static void getContactListTest()
    {
        GenericRecordPageApex.getContactList();
    }
    @isTest
    public Static void getOpportunityListTest()
    {
        GenericRecordPageApex.getOpportunityList();
    }
}