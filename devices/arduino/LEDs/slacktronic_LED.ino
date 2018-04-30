/*
  It reads characters from the serial input and sends digital writes or low depending on its value.
  Capital leters means HIGH, downcase LOW.
  Currently, the actuators are hardcoded to for outputs
*/

char receivedChar;
boolean newData = false;
const int ACTUATOR_A = 2;
const int ACTUATOR_B = 6;
const int ACTUATOR_C = 10;
const int ACTUATOR_D = 12;
int actuator;
int actuatorSignal;


void setup() {
 Serial.begin(57600);
 Serial.println("<Arduino is ready>");
 pinMode(ACTUATOR_A, OUTPUT);
 pinMode(ACTUATOR_B, OUTPUT);
 pinMode(ACTUATOR_C, OUTPUT);
 pinMode(ACTUATOR_D, OUTPUT);
}

void loop() {
 recvOneChar();
 showNewData();
}

void recvOneChar() {
 if (Serial.available() > 0) {
 receivedChar = Serial.read();
 newData = true;
 }
}

void showNewData() {
 if (newData == true) {
   actuator = 0;
   newData = false;

   switch(receivedChar) {
   case 'A':
      actuator = ACTUATOR_A;
      actuatorSignal = HIGH;
      break; 
   case 'B':
     actuator = ACTUATOR_B;
     actuatorSignal = HIGH;
     break; 
   case 'C':
     actuator = ACTUATOR_C;
     actuatorSignal = HIGH;
     break; 
   case 'D':
     actuator = ACTUATOR_D;
     actuatorSignal = HIGH;
     break;
   case 'a':
      actuator = ACTUATOR_A;
      actuatorSignal = LOW;
      break; 
   case 'b':
     actuator = ACTUATOR_B;
     actuatorSignal = LOW;
     break; 
   case 'c':
     actuator = ACTUATOR_C;
     actuatorSignal = LOW;
     break; 
   case 'd':
     actuator = ACTUATOR_D;
     actuatorSignal = LOW;
     break; 
   }
   digitalWrite(actuator, actuatorSignal);
   delay(1);
 }
}
