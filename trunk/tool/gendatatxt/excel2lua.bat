@tasklist /nh>e:\temp.txt
@find /i "excel.exe" e:\temp.txt
@if ERRORLEVEL 1 (echo ������
"test.bat") else (echo excel.exe������)
@pause