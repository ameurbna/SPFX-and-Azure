Param(
[string]$scriptPath="C:\Users\Administrator\Desktop\Deploy Solution",
[string]$username="ameur@trainingBna.onmicrosoft.com",
[string]$password="P@ssword",
[string]$SiteAppCatalogUrl="https://trainingbna.sharepoint.com/sites/Apps/"
)
cd $scriptPath
$cred = New-Object -TypeName System.Management.Automation.PSCredential -argumentlist $userName, $(convertto-securestring $Password -asplaintext -force)
Connect-PnPOnline -Url $SiteAppCatalogUrl  -Credentials $cred
Get-ChildItem –Path "$scriptPath\packages" |
Foreach-Object {

         Write-Host "Adding "$_.Name -ForegroundColor Green
         Add-PnPApp -Path $_.FullName -Publish
        
}
