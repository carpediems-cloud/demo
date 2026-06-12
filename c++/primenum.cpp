#include<iostream>
using namespace std;

int main(){
    int num;
    cout<<"Enter a number: ";
    cin>>num;
    int flag = 0;
    for(int i = 2; i < num; i++){
        if(num % i == 0){
            flag = 1;
            break;
        }
    }
    if(flag == 1){
        cout<<"Not a prime number";
    }else{
        cout<<"Prime number";
    }
    return 0;
}
