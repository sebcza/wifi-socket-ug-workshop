import { Component } from '@angular/core';
import { MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private mqttService: MqttService) {
    this.mqttService.connect();
  }
  title = 'SocketCubeApp';

  turnOff() {
    this.mqttService.unsafePublish('gniazdka/salon', '16266309', {qos: 0, retain: true});
  }

  turnOn() {
    console.log('Turn On command send');
    this.mqttService.unsafePublish('gniazdka/salon', '16575493', {qos: 0, retain: true});
  }
}
