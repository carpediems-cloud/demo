#include <iostream>

using namespace std;
class Arithmatic{
public:
  void add(int a, int b){
    cout << "Sum = " << a + b << endl;
  }
  void sub(int a, int b){
    cout << "Difference = " << a - b << endl;
  }
  void mul(int a, int b){
    cout << "Product = " << a * b << endl;
  }
  void div(int a, int b){
    cout << "Division = " << a / b << endl;
  }
};

int main(){
  Arithmatic a;
  a.add(10, 20);
  a.sub(10, 20);
  a.mul(10, 20);
  a.div(10, 20);
  return 0;
}
