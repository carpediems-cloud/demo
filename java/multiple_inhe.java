interface Camera {
    void takePhoto();
}

interface Phone {
    void makeCall(String number);
}

// SmartPhone implements both Camera and Phone interfaces, achieving multiple inheritance
class SmartPhone implements Camera, Phone {
    @Override
    public void takePhoto() {
        System.out.println("Taking a photo...");
    }

    @Override
    public void makeCall(String number) {
        System.out.println("Calling " + number + "...");
    }
}

public class multiple_inhe {
    public static void main(String[] args) {
        SmartPhone myPhone = new SmartPhone();
        myPhone.makeCall("123-456-7890");
        myPhone.takePhoto();
    }
}
