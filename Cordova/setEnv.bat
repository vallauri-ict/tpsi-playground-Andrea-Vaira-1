@echo off

REM percorso JAVA JDK 
SET JAVA_HOME=C:\Programmi\Java\jdk-11.0.17

REM percorso ANDROID SDK
SET ANDROID_SDK_ROOT=C:\android


SET PATH=%PATH%;C:\Programmi\Java\jdk-11.0.17\bin;
SET PATH=%PATH%;C:\android\tools;
SET PATH=%PATH%;C:\android\platform-tools;
SET PATH=%PATH%;C:\android\gradle-7.6\bin;

echo done


