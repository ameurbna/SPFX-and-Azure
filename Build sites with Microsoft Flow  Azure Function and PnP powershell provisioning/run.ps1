$in = Get-Content $triggerInput -Raw
Write-Output "PowerShell script processed queue message '$in'"
$SPO_AppId=$env:ClientID
$SPO_AppSecret=$env:ClientSecret
Connect-PnPOnline -AppId $SPO_AppId -AppSecret $SPO_AppSecret -Url $in
$apps=Get-PnPApp
$apps | Foreach-Object {
 Write-Host $_.Title
 Install-PnPApp -Identity $_.Id
}
 
$i=1
Do { 
    $list=Get-PnPList -Identity Lists/SPFxMenuList
    if($list -eq $null){
         sleep -Seconds 20
    }
    Write-Host $i
    $i++
} while ($i -le 10 -and $list -eq $null)
Apply-PnPProvisioningTemplate -Path D:\home\site\wwwroot\ApplyTemplatePnpSiteBook\site-template.xml