import { Component, OnInit, } from '@angular/core';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { constructor } from 'q';
import { title } from 'process';

export class Seria {
  name: string;
  value: string;

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    this.httpClient.get("http://hackcube.azurewebsites.net/api/values/humidity/today").subscribe((h: any[]) => {
      this.httpClient.get("http://hackcube.azurewebsites.net/api/values/temp/today").subscribe((t: any[]) =>{
        const humidity = h.map(x => new Seria(x.measureDate, x.humidity));
        const temps = t.map(x => new Seria(x.measureDate, x.temp));
        this.multi = [{
          name: 'Humidity',
          series: humidity
        },
        {
          name: 'Temp',
          series: temps
        }
        ];
      });
    });
  }

  constructor(private mqttService: MqttService, private httpClient: HttpClient) {
    this.mqttService.connect();
    this.mqttService.observe('testcube/temp').subscribe((message: IMqttMessage) => {
      this.temp = message.payload.toString();
    });

    this.mqttService.observe('testcube/humidity').subscribe((message: IMqttMessage) => {
      this.humidity = message.payload.toString();
    });
    this.mqttService.observe('sypialnia/temp').subscribe((message: IMqttMessage) => {
      this.temp_sypialnia = message.payload.toString();
    });

    this.mqttService.observe('sypialnia/humidity').subscribe((message: IMqttMessage) => {
      this.humidity_sypialnia = message.payload.toString();
    });
  }

  temp = 'connecting...';
  humidity = 'connecting...';
  temp_sypialnia = 'connecting...';
  humidity_sypialnia = 'connecting...'; 
  title = 'SocketCubeApp';

  turnOff() {
    this.mqttService.unsafePublish('gniazdka/salon', '16266309', {qos: 0, retain: true});
  }

  turnOn() {
    console.log('Turn On command send');
    this.mqttService.unsafePublish('gniazdka/salon', '16575493', {qos: 0, retain: true});
  }


  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Hours';
  showYAxisLabel = true;
  yAxisLabel = 'Temp C/Humidity %';
  timeline = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


multi: any[] = [
  {
    name: 'Humidity',
    series: [
      {
        name: 5,
        value: 2650
      },
      {
        name: 10,
        value: 2800      },
      {
        name: 15,
        value: 2000
      }
    ]
  },
  {
    name: 'Temp',
    series: [
      {
        name: 5,
        value: 2500
      },
      {
        name: 10,
        value: 3100
      },
      {
        name: 15,
        value: 2350
      }
    ]
  }
];
}
