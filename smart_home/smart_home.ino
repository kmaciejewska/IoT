#include <Stepper.h>
#include <SoftwareSerial.h>
SoftwareSerial esp8266(2,3); //Pin 2 & 3 of Arduino as RX and TX. Connect TX and RX of ESP8266 respectively.
#define DEBUG true

//lights
#define led_left_top 8
#define led_left_down 12
#define led_right 13

//disco!
#define time_out 500
#define red_led_pin 5
#define green_led_pin 6
#define blue_led_pin 11

#define colors_number 9
bool discoState = false;
int red_light_values[] =   {0, 0,   0,   0,   255, 0,   255, 255, 255};
int green_light_values[] = {0, 255, 255, 0,   255, 255, 0,   255, 255};
int blue_light_values[] =  {0, 255, 0,   255, 125, 255, 255, 0,   255};

uint8_t i = 1; //to iterate over arrays of colors, first (0) index turns the led off
long currentTime = 0;

//alarm
#define BUZZER 4
#define PIR 7
int LED_ARMING = A4;
int LED_ALARM = A5;
#define TIME_TO_LEAVE 10                // in seconds

boolean arming = false;                 // helps to blink led while arming
boolean armed = false;                  // is the alarm armed?
int intruder = LOW;                     // is there an intruder?
int val = 0;                            // value on the PIR sensor
int buttonState = LOW;                  // this just helps to print out in serial once (not continuously)
int counter;                            // counts clicks on alarm button
long currentAlarmTime = 0;              // for buzzer sound without delay
uint8_t index = 0;

//garage gate
#define STEPS_PER_REV 32                //number of steps per internal motor revolution
#define GEAR_RED 64                     //amount of gear reduction
const float STEPS_PER_OUT_REV = STEPS_PER_REV * GEAR_RED;   //number of steps per geared output rotation
bool garageUp = false, garageDown = false;

Stepper motor(STEPS_PER_REV, A0, A1, A2, A3);

bool motorRunning = false;
long currentStepperTime = 0;
long timeOut = 1000;
int stepperCounter = 0;


void setup() {
  //regular lights
  pinMode(led_left_top, OUTPUT);
  pinMode(led_left_down, OUTPUT);
  pinMode(led_right, OUTPUT);
  
  //disco - not necessary to set as output
  pinMode(red_led_pin, OUTPUT);
  pinMode(green_led_pin, OUTPUT);
  pinMode(blue_led_pin, OUTPUT);

  //alarm
  pinMode(BUZZER, OUTPUT);
  pinMode(PIR, INPUT);
  pinMode(LED_ALARM, OUTPUT);
  pinMode(LED_ARMING, OUTPUT);
  digitalWrite(LED_ARMING, LOW);

  //motor
  motor.setSpeed(300);
  
  Serial.begin(9600);
  
  esp8266.begin(115200); //Baud rate for communicating with ESP8266
  esp8266SendCommand("AT+RST\r\n", 2000, DEBUG); // Reset the ESP8266
  esp8266SendCommand("AT+CWMODE=1\r\n", 1000, DEBUG); //Set station mode Operation, configure as access point
  esp8266SendCommand("AT+CWJAP=\"Tenda_11A608\",\"12345678\"\r\n", 3000, DEBUG);//Connect with WiFi network
  while(!esp8266.find("OK")) {}
  esp8266SendCommand("AT+CIFSR\r\n", 1000, DEBUG);//get IP address 
  esp8266SendCommand("AT+CIPMUX=1\r\n", 1000, DEBUG);  //configure for multiple connections
  esp8266SendCommand("AT+CIPSERVER=1,80\r\n", 1000, DEBUG);  //turn on server on port 80
}

void loop() {
  if (esp8266.available()) {  //check if the esp is sending a message 
    if (esp8266.find("+IPD")) {
      delay(1000);
      
      String msg = "";
      esp8266.find("?");  //advance cursor to ?
      msg = esp8266.readStringUntil(' ');
      Serial.println(msg);
      String command1 = msg.substring(0, 3), commandLed, command2;
      int pinNumber = msg.substring(4).toInt();
      int secondNumber = msg.substring(5).toInt(); //if the pinNumber < 10 then there is 0 here
      
      if (DEBUG) {
        //Serial.println(command1);
        //Serial.println(pinNumber);  //must print the pin number
        //Serial.println(secondNumber); //Must print the second digit
      }

      if (secondNumber != 0) {
        commandLed = msg.substring(6);  //if the pin number has two digits ON/OFF starts later
      } else {
        commandLed = msg.substring(5);
      }

      if (command1 == "led") {
        lights(pinNumber, commandLed);
      } else if (command1 == "dis") {
        command2 = msg.substring(4);
        disco(command2);
      } else if (command1 == "alm") {
        command2 = msg.substring(4);
        if (command2 == "ON" || command2 == "OFF") {
          counter++;
        } 
      } else if (command1 == "gar") {
        command2 = msg.substring(4);
        if (command2 == "ON") {
          garageUp = true;
          garageDown = false;
        } else {
          garageUp = false;
          garageDown = true;
        }
        motorRunning = true;
        stepperCounter = 0;
      }
    }
  }

  if (discoState) {
    disco("ON");
  }

  if (garageUp) {
    garage(-STEPS_PER_OUT_REV);
  } else if (garageDown) {
    garage(STEPS_PER_OUT_REV);
  }
  
  if (counter % 2 == 0) {                   //counter for the alarm
    armed = false;
  } else {
    armed = true;
  } 
  
  //======================================

  // Permanently check the PIR state
  checkPIR();
  
  //=========================================

  // Permanently check the alarm state
  checkAlarm();
  
  //=========================================
  
}

void disco(String command) {
  if (command == "ON") {
     discoState = true;
    if (millis() - currentTime > time_out) {
      rgb(i);
      i++;
      currentTime = millis();
      if (i == colors_number) {
        i = 1;
      }
    }
  } else {
    discoState = false;
    i = 0;
    rgb(i);
  }
}

void rgb(uint8_t index) {
  analogWrite(red_led_pin, red_light_values[index]);
  analogWrite(green_led_pin, green_light_values[index]);
  analogWrite(blue_led_pin, blue_light_values[index]);
}

void lights(int pin, String command2) {
  if(command2 == "ON") {
    digitalWrite(pin, HIGH);
  } else {
    digitalWrite(pin, LOW); 
  }
}

void checkPIR() {
  val = digitalRead(PIR);  // read sensor value
  if (val == HIGH) {       // check if the input is HIGH
    //digitalWrite(LED_ALARM, HIGH);  // turn LED ON
    if (intruder == LOW) {
      // we have just turned on
      Serial.println("Motion detected!");
      // We only want to print on the output change, not state
      intruder = HIGH;
    }
  } else {
    //digitalWrite(LED_ALARM, LOW); // turn LED OFF
    if (intruder == HIGH){
      // we have just turned of
      Serial.println("Motion ended!");
      // We only want to print on the output change, not state
      intruder = LOW;
    }
  }
}

// sound the alarm
void alarm() {
  if (millis() - currentAlarmTime > 150) {
    if (index%2 == 0) {
      tone(BUZZER, 4300);                        // sound of 4300Hz frequency
    } else {
      tone(BUZZER, 3500);                        // sound of 3500Hz frequency
    }
    index++;
    currentAlarmTime = millis();
  }
}

void checkAlarm() {
  if (armed == true) {                      // alarm armed

    //-----------------------------------------
    // delay in arming - leaves time for leaving the house
    if (arming == false) {
      for (int i = 0; i <= TIME_TO_LEAVE; i++) { // LED_ARMING blinks over the TIME_TO_LEAVE seconds
        digitalWrite(LED_ARMING, HIGH);
        delay(500);
        
        digitalWrite(LED_ARMING, LOW);
        delay(500);
      }
      arming = true;                         // alarm has been armed
    }
    //-----------------------------------------
                                                 
    digitalWrite(LED_ARMING, HIGH);              // turn on LED_ARMING - alarm armed
  
    //outpu to Serial port 
    if(buttonState == LOW) {
      Serial.println("; Alarm armed");      
      buttonState = HIGH;                      
    }
                                                  // check PIR
     if (intruder == HIGH) {                      // activity encountered
       alarm();                                   // turn on the BUZZER
       digitalWrite(LED_ALARM, HIGH);             // turn LED ON
     } else {                                   // activity stopped
       noTone(BUZZER);                          // turn off the BUZZER
       digitalWrite(LED_ALARM, LOW);            // turn LED OFF
       index = 0;                               //reset buzzer index
     }


  } else {                                       //alarm not armed
    noTone(BUZZER);                              // turn off the BUZZER
    digitalWrite(LED_ARMING, LOW);               //turn off LED_ARMING
    
    if(buttonState == HIGH){
      Serial.println("; Alarm unarmed");  
      buttonState = LOW;                       
    }
    
    arming = false;                          //this helps while pre-arming and blinking the diode, must be initially false
  }
  
}

void garage(float stepsRequired) {
  if (millis() - currentStepperTime > timeOut) { //measure 4s
      currentStepperTime = millis();
      stepperCounter++;
      if (stepperCounter == 2) {
        motorRunning = false;
        garageUp = false;
        garageDown = false;
      }
      //Serial.println(stepsRequired);
  }

  if (motorRunning) {
    motor.step(stepsRequired);
  }
}

/*
* Description: Function used to send data to ESP8266.
* Params: command - the data/command to send; timeout - the time to wait for a response; debug - print to Serial window?(true = yes, false = no)
* Returns: The response from the esp8266 (if there is a reponse)
*/
String esp8266SendCommand(String command, const int timeout, boolean debug) {
  String response = "";
  esp8266.print(command);
  long int time = millis(); //current time
  while (time + timeout > millis()) { //wait specified timeout
    while (esp8266.available()) {
      char c = esp8266.read();
      response += c;
    }
  }

  if (debug) {
    Serial.println(response);
  }
  return response;
}
