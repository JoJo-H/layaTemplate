@tasklist /nh>e:\temp.txt
@find /i "excel.exe" e:\temp.txt
@if ERRORLEVEL 1 (echo 生成中
"test.bat") else (echo excel.exe运行中)
@pause