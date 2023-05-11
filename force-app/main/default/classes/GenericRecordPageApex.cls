public class GenericRecordPageApex 
{
    @AuraEnabled
    public static List<Account> getAccountList() {
        return [Select Id,Name, Phone, NumberOfEmployees, Owner.Name, AnnualRevenue  from account limit 5000];
    }
    @AuraEnabled
    public static List<Contact> getContactList() {
        return [SELECT Id, FirstName,LastName,AccountId,Account.Name,phone,email FROM contact limit 5000];
    }
    @AuraEnabled
    public static List<Opportunity> getOpportunityList() {
        return [Select id,Name, CreatedDate,Amount, StageName,  Account.Name from Opportunity limit 5000];
    }
}