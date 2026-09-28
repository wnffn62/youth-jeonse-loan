# 청년 전세대출 제도 변경 자동 점검을 작업 스케줄러에 등록한다.
# 실행: PowerShell 에서  .\tools\자동점검_등록.ps1
# 해제: .\tools\자동점검_등록.ps1 -Remove

param(
    [switch]$Remove,
    [string]$Time = "09:10",
    [ValidateSet("Daily", "Weekly")]
    [string]$Cycle = "Weekly"
)

$ErrorActionPreference = "Stop"
$TaskName = "청년전세대출_제도변경점검"
$Root = Split-Path -Parent $PSScriptRoot
$Script = Join-Path $Root "tools\update_policies.py"

if ($Remove) {
    try {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction Stop
        Write-Host "예약 작업을 해제했습니다: $TaskName"
    } catch {
        Write-Host "등록된 작업이 없습니다: $TaskName"
    }
    exit 0
}

if (-not (Test-Path $Script)) {
    Write-Host "점검 스크립트를 찾지 못했습니다: $Script"
    exit 1
}

$Python = (Get-Command python -ErrorAction SilentlyContinue).Source
if (-not $Python) {
    Write-Host "python 실행 파일을 찾지 못했습니다. PATH 를 확인하세요."
    exit 1
}

$Action = New-ScheduledTaskAction -Execute $Python `
    -Argument ('"{0}" --apply' -f $Script) -WorkingDirectory $Root

if ($Cycle -eq "Daily") {
    $Trigger = New-ScheduledTaskTrigger -Daily -At $Time
} else {
    $Trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At $Time
}

# 노트북 배터리 구동 중에도 실행되게 한다.
# 배터리 전환 시 작업이 멈춰 점검이 조용히 누락된 이력이 있다.
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 20) `
    -MultipleInstances IgnoreNew

Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger `
    -Settings $Settings -Description "청년 전세대출 제도 변경 감지 및 자동 반영" -Force | Out-Null

Write-Host "예약 작업을 등록했습니다."
Write-Host "  이름   $TaskName"
Write-Host ("  주기   {0} {1}" -f $(if ($Cycle -eq "Daily") { "매일" } else { "매주 월요일" }), $Time)
Write-Host "  대상   $Script"
Write-Host ""
Write-Host "변경이 감지되면 _work\reports\ 에 보고서를 저장합니다."
Write-Host "금리·요건 수치가 걸린 변경은 확정 대기로 들어가며, 사람이 확인한 뒤 반영합니다."
