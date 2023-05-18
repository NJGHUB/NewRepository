public with sharing class Custom_Account_Apex 
{
    @AuraEnabled
    public static List<Account> GetAccount() 
    {
        return [Select Id,Name,NumberOfEmployees,Phone from Account Order By CreatedDate DESC];
    }
    @AuraEnabled
    public static String GetUserDomainName()
    {
        String DomainUrl = String.valueof(System.URL.getSalesforceBaseURL().gethost());
        System.debug('User Domain : '+DomainUrl);
        return DomainUrl; 
    }
    @AuraEnabled
    public static List<Contact> GetRelatedContacts(Id accId)
    {
        return [Select Id,Name,Phone,Email from Contact Where AccountId =:accId];
    }
    @AuraEnabled
    public static List<Opportunity> GetRelatedOpportunity(Id accId)
    {
        return [Select Id,Name,Amount,StageName from Opportunity Where AccountId =:accId];
    }
    @AuraEnabled
    public static List<Account> GetBySearch(String value)
    {
        return [Select Id,Name,NumberOfEmployees,Phone from Account Where Name Like:'%'+value+'%'];
    }
}