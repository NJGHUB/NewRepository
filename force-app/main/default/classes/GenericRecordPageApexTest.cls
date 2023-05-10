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
    @isTest
    public Static void getContactList2Test()
    {
        GenericRecordPageApex.getContactList2();
    }
    @isTest
    public Static void getAccountTest()
    {
        Account acc = new Account(Name='Test');
        insert acc;
        GenericRecordPageApex.getAccount(acc.Id);
    }
}