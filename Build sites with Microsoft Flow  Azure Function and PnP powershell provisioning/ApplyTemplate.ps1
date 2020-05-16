Param(
[string]$siteUrl="https://trainingbna.sharepoint.com/sites/SiteBook",
[string]$SPO_AppId="",
[string]$SPO_AppSecret=""
)
#$cred = New-Object -TypeName System.Management.Automation.PSCredential -argumentlist $userName, $(convertto-securestring $Password -asplaintext -force)
#Connect-PnPOnline -Url  $siteUrl -Credentials $cred
Connect-PnPOnline -AppId $SPO_AppId -AppSecret $SPO_AppSecret -Url $siteUrl
Apply-PnPProvisioningTemplate -Path .\site-template.xml
