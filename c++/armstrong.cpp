#include<stdio.h>

int main(){
    int num;
    int sum=0;
    int digit;
    
    printf("Enter a number: ");
    scanf("%d",&num);
    
    int temp=num;
    while(temp>0){
        digit=temp%10;
        sum+=digit*digit*digit;
        temp/=10;
    }
    
    if(sum==num){
        printf("The number is an Armstrong number");
    }else{
        printf("The number is not an Armstrong number");
    }
    
    return 0;
}