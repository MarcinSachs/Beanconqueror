import { Injectable } from '@angular/core';
import {UIHelper} from '../uiHelper';
import {Deeplinks} from '@ionic-native/deeplinks/ngx';
import {InfoComponent} from '../../app/info/info.component';
import {UILog} from '../uiLog';
import {Url} from 'url';
declare var window;
@Injectable({
  providedIn: 'root'
})
export class IntentHandlerService {

  public static SUPPORTED_INTENTS = {
    ADD_BEAN_ONLINE: 'ADD_BEAN_ONLINE'
  };
  constructor(private readonly uiHelper: UIHelper,
              private readonly deeplinks: Deeplinks,
              private readonly uiLog: UILog) { }

  public attachOnHandleOpenUrl() {

    // https://github.com/ionic-team/ionic-plugin-deeplinks/issues/243 - to be done
    this.deeplinks.route( {
      '/NO_LINK_EVER_WILL_WORK_HERE/':  '/NO_LINK_EVER_WILL_WORK_HERE/'
  }).subscribe((match) => {
      // The plugin has some issues, therefore we use success and error case and hope for better times
        this.uiLog.log('Deeplink matched');
        this.handleDeepLink(match.$link);
      },
      (nomatch) => {
        this.uiLog.log('Deeplink not matched');
        this.handleDeepLink(nomatch.$link);
      });
  }
  private findGetParameter(_url: string,_parameterName: string) {
    let result = null,
      tmp = [];
    _url.split('&')
      .forEach( (item) => {
        tmp = item.split('=');
        if (tmp[0] === _parameterName) result = decodeURIComponent(tmp[1]);
      });
    return result;
  }

  private findParameterByCompleteUrl(_url,_parameter) {
    const url: Url = new URL(_url);
    const val = url.searchParams.get(_parameter);
    return val;
  }

  public handleQRCodeLink(_url) {
    this.uiHelper.isBeanconqurorAppReady().then(() => {
      const url: string = _url;

      this.uiLog.log('Handle QRcode Link:' + url);
      if (url.indexOf('https://beanconqueror.com/app/roaster/bean') === 0) {
        const onlineBeanId: number = Number(this.findParameterByCompleteUrl(url,'id'));
        this.addBeanFromServer(onlineBeanId);
      }
    });
  }

  private handleDeepLink(_matchLink) {
    try {
      if (_matchLink && _matchLink.url) {
        this.uiHelper.isBeanconqurorAppReady().then(() => {
          const url: string = _matchLink.url;

          this.uiLog.log('Handle deeplink:' + url);
          this.uiLog.log(JSON.stringify(_matchLink));
          if (url.indexOf('https://beanconqueror.com/app/roaster/bean') === 0) {
            const onlineBeanId: number = Number(this.findGetParameter(_matchLink.queryString,'id'));
            this.addBeanFromServer(onlineBeanId);
          } else if (url.indexOf('beanconqueror://ADD_BEAN_ONLINE?') === 0) {
            const onlineBeanId: number = Number(_matchLink.queryString);
            this.addBeanFromServer(onlineBeanId);
          }
        });
      }

    }catch (ex) {

    }

  }




  private addBeanFromServer(_beanId: number) {
    this.uiLog.log('Load bean information from server: ' + _beanId);
  }

}
