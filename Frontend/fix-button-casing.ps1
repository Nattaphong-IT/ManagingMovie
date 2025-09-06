# อยู่ในโฟลเดอร์ Frontend/
# บันทึกเป็น fix-button-casing.ps1 แล้วรัน

# หาไฟล์ .ts/.tsx ทั้งหมดใน src
Get-ChildItem -Recurse -Include *.ts,*.tsx src |
ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath

    # แก้ path แบบ relative ../ui/button หรือ UI/Button
    $content = $content -replace '(\.\./)+ui/button', '${1}UI/Button'

    # แก้ path แบบ alias @/components/ui/button
    $content = $content -replace '@\/components\/ui\/button', '@/components/UI/Button'

    # เขียนกลับไฟล์
    Set-Content -Path $filePath -Value $content
}

Write-Host "✅ แก้ import ui/button เป็น UI/Button เรียบร้อยแล้ว"