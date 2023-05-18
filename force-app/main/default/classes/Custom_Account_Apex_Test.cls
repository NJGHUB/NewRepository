@isTest
public class Custom_Account_Apex_Test 
{
    @testSetup static void setup() 
    {
        List<Account> accList = new List<Account>();
		for(integer i=1;i<10;i++)
        {
            Account acc = new Account();
            acc.Name = 'Test Account '+i;
            accList.add(acc);
        }
        Insert accList;
       	
        Account newAccount = new Account(Name='Test Single');
        Insert newAccount;
        
        List<Contact> conList = new List<Contact>();
		for(integer i=1;i<10;i++)
        {
            Contact con = new Contact();
            con.LastName = 'Test Contact '+i;
            con.AccountId = newAccount.Id;
            conList.add(con);
        }
        Insert conList;
        
        List<Opportunity> oppList = new List<Opportunity>();
		for(integer i=1;i<10;i++)
        {
            Opportunity opp = new Opportunity();
            opp.Name = 'Test Opportunity '+i;
            opp.CloseDate = Date.today();
            opp.StageName = 'Close Won';
            opp.AccountId = newAccount.Id;
            oppList.add(opp);
        }
        Insert oppList; 
    }
    static testMethod void GetAccountTest() 
    {
        List<Account> accList = [Select Name from Account Limit 5];
        System.debug('Account List '+accList);
       
        Test.startTest();
        Custom_Account_Apex.GetAccount();     
		Test.stopTest();
    } 
    static testMethod void GetUserDomainNameTest() 
    {
        Test.startTest();
        String DomainUrl = Custom_Account_Apex.GetUserDomainName(); 
        System.debug('DomainUrl '+DomainUrl);
		Test.stopTest();
    }
    static testMethod void GetRelatedContactsTest() 
    {
        Account acc = [Select Id from Account Where Name ='Test Single' Limit 1];
        
        Test.startTest();
        List<Contact> conList = Custom_Account_Apex.GetRelatedContacts(acc.Id); 
        System.debug('conList '+conList);
		Test.stopTest();
    }
    static testMethod void GetRelatedOpportunityTest() 
    {
        Account acc = [Select Id from Account Where Name ='Test Single' Limit 1];
        
        Test.startTest();
        List<Opportunity> oppList = Custom_Account_Apex.GetRelatedOpportunity(acc.Id); 
        System.debug('oppList '+oppList);
		Test.stopTest();
    }
    static testMethod void GetBySearch() 
    {
        Test.startTest();
        List<Account> acc = Custom_Account_Apex.GetBySearch('Test'); 
        System.debug('acc '+acc);
		Test.stopTest();
    }
}