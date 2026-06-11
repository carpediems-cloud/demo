#include <iostream>

class test{
public:
  void print(){
    std::cout<<"hello world";
  }
};


int main(){
  test t;
  t.print();
  return 0;
}
