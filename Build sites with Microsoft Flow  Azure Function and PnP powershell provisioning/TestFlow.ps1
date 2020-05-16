Param(
[string]$siteAdminUrl="https://trainingbna-admin.sharepoint.com",
[string]$userName="ameur@trainingBna.onmicrosoft.com",
[string]$Password="P@ssword"
)
$cred = New-Object -TypeName System.Management.Automation.PSCredential -argumentlist $userName, $(convertto-securestring $Password -asplaintext -force)
Connect-SPOService -Url $siteAdminUrl  -Credential $cred
$uri = "https://prod-04.francecentral.logic.azure.com:443/workflows/b1803944b21941c1aa635df52e771094/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=LH1crXpzfuI2IyfnjmcdMyWmtt1BJzYEKNJ9hHlo71c"
$body = "{webUrl:'https://trainingbna.sharepoint.com/sites/SiteBook2'}"
Invoke-RestMethod -Uri $uri -Method Post -ContentType "application/json" -Body $body