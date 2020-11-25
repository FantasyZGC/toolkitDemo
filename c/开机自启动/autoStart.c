#include <windows.h>
#include <stdio.h>
 
int main(int argc, char *argv[])
{

    HKEY keyz;
    char *Register = "Software\\Microsoft\\Windows\\CurrentVersion\\Run";//这是要写进的注册表的地方
    char *Myapp = argv[1];//这是我们需要自启动的程序的绝对路径
    printf("%s\n",Myapp);
    //打开注册表启动项 
    if(RegOpenKeyExA(HKEY_CURRENT_USER, Register, 0, KEY_ALL_ACCESS, &keyz)== ERROR_SUCCESS)
    {
        RegSetValueExA(keyz, "Mytest", 0, REG_SZ, (BYTE *)Myapp, strlen(Myapp));
        //关闭注册表
        RegCloseKey(keyz);
        
        printf("succeed!\n");//执行成功输出
    }
    else
    {
        return -1;
        printf("Failed!");//执行失败
    }
  
}