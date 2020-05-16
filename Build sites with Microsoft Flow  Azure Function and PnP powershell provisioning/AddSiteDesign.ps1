Param(
[string]$siteAdminUrl="https://trainingbna-admin.sharepoint.com",
[string]$userName="ameur@trainingBna.onmicrosoft.com",
[string]$Password="P@ssword"
)
$cred = New-Object -TypeName System.Management.Automation.PSCredential -argumentlist $userName, $(convertto-securestring $Password -asplaintext -force)
Connect-SPOService -Url $siteAdminUrl  -Credential $cred
$script = Get-Content -Path .\SiteBookScript.json -Raw
$siteScript=Add-SPOSiteScript -Title "Apply PnP Provisioning Site Book Template" -Content $script
Add-SPOSiteDesign -Title "Site Book Template" -SiteScripts $siteScript.Id -WebTemplate "64"