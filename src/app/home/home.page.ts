import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('lineCanvas', null) lineCanvas: ElementRef;

  private lineChart: Chart;
  city = 'Mykolaiv';
  url = '';
  responseList: any = [];
  totalWeatherPages = 0;
  weatherPage = 0;
  viewDate = '';
  weatherMap: any = [];
  viewPage = {
    city: '',
    date: '',
    hourly: []
  };
  showWeatherCard = false;
  showChart = false;
  showNavButtons = false;
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoplay: 1
  }
  ////////////////////////////////////////////
  constructor(public http: HttpClient) {}
  ////////////////////////////////////////////
  recieveWeather() {
    if (this.city === '') {
      return;
    }
    this.url = `http://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=4b8151c8aacd8ec56df9c10862bd1ddc`;
    console.log(this.url);
    this.http.get(this.url, {})
    .subscribe(data => {
      const anyData = data as any;
      this.responseList = anyData.list;
      this.weatherMap = [];
      this.viewDate = '';
      this.aggregateList();
    }, error => {
      console.error('recieveWeather() http error: ', error);
    });
  }
  ////////////////////////////////////////////
  aggregateList() {
    let dateTime = [], statObj = null, hourlyObj = null, temp = 0;
    this.showWeatherCard = this.showNavButtons = true;
    console.log(this);
    for (const hourStat of this.responseList) {
      //console.log(hourStat);
      dateTime = hourStat.dt_txt.split(' ');
      if (dateTime[0] !== this.viewDate) {
        if (this.viewDate !== '') {
          this.weatherMap.push(statObj);
        }
        statObj = {
          city: '',
          date: '',
          hourly: []
        };
        this.viewDate = statObj.date = dateTime[0];
        statObj.city = this.city;
      }
      hourlyObj = {
          time: '',
          temp: '',
          description: '',
          image: `https://openweathermap.org/img/wn/${hourStat.weather[0].icon}@2x.png`,
          humidity: ''
      };
      dateTime = dateTime[1].split(':');
      hourlyObj.time = dateTime[0] + ':' + dateTime[1];
      hourlyObj.description = hourStat.weather[0].description;
      hourlyObj.humidity = hourStat.main.humidity;
        temp = Math.round(hourStat.main.temp - 273);
        if (temp > 0) {
          hourlyObj.temp = '+' + temp;
        } else {
          hourlyObj.temp = temp;
        }
        statObj.hourly.push(hourlyObj);
    }
    if (statObj) {
      this.weatherMap.push(statObj);
      this.responseList = [];
      this.viewPage = this.weatherMap[this.weatherPage];
      this.totalWeatherPages = this.weatherMap.length;
      console.log(this.weatherMap);
      this.fillChart();
    }
  }
  //////////////////////////////////////////////////
  changePage(direction) {
    if (direction === 'left') {
      if (this.weatherPage === 0) {
        this.weatherPage = this.totalWeatherPages - 1;
      } else {
        this.weatherPage--;
      }
    } else {
      if (this.weatherPage === this.totalWeatherPages - 1) {
        this.weatherPage = 0;
      } else {
        this.weatherPage++;
      }
    }
    console.log(this.weatherPage, this.totalWeatherPages);
    this.viewPage = this.weatherMap[this.weatherPage];
    this.fillChart();
  }
  //////////////////////////////////////////////////
  fillChart () {
    let time = [], temp = [], humidity = [];
    for (const stat of this.viewPage.hourly) {
      time.push(stat.time);
      temp.push(stat.temp);
      humidity.push(stat.humidity);
    }
    console.log(time, temp, humidity);
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
          type: 'line',
          data: {
            labels: time,
            datasets: [
              {
                label: 'Temp',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                data: temp,
                spanGaps: true
              },
              {
                label: 'Humidity',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,156,102,0.4)',
                borderColor: 'rgba(75,156,102,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,156,102,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,156,102,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                data: humidity,
                spanGaps: true
              }
            ]
          }
      });
  }
}
