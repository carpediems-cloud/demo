#include<stdio.h>

int main(){
  int num;
  printf("Enter a number: ");
  scanf("%d", &num);
  int flag = 0;
  for(int i = 2; i < num; i++){
    if(num % i == 0){
      flag = 1;
      break;
    }
  }
  if(flag == 1){
    printf("Not a prime number");
  }else{
    printf("Prime number");
  }
  return 0;
}
