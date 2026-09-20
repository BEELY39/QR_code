import { formatWifiPayload, escapeWifiString } from './wifi-formatter';
import { WifiConfig } from '../models/live-qr.model';

describe('formatWifiPayload (Catégorie 2 - Test Unitaire)', () => {
  it('devrait encoder une Freebox WPA2 avec le token standard T:WPA et S: en premier', () => {
    const config: WifiConfig = {
      ssid: 'Freebox-667ekip',
      encryption: 'WPA2',
      password: '369258147Az',
      hidden: false,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:S:Freebox-667ekip;T:WPA;P:369258147Az;;');
  });

  it('devrait formater une connexion WPA visible standard sans le flag H:false', () => {
    const config: WifiConfig = {
      ssid: 'MyNetwork',
      encryption: 'WPA',
      password: 'MySuperPassword123!',
      hidden: false,
    };
    const result = formatWifiPayload(config);
    // CRITIQUE : S: en premier, T: en second, sans H:false;
    expect(result).toBe('WIFI:S:MyNetwork;T:WPA;P:MySuperPassword123!;;');
  });

  it('devrait inclure H:true uniquement quand le réseau est masqué', () => {
    const config: WifiConfig = {
      ssid: 'HiddenNetwork',
      encryption: 'WPA2',
      password: 'SecretPassword',
      hidden: true,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:S:HiddenNetwork;T:WPA;P:SecretPassword;H:true;;');
  });

  it('devrait formater une connexion WEP correctement', () => {
    const config: WifiConfig = {
      ssid: 'OldNetwork',
      encryption: 'WEP',
      password: 'WEPPassword',
      hidden: false,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:S:OldNetwork;T:WEP;P:WEPPassword;;');
  });

  it('devrait formater une connexion ouverte (nopass) sans tag P et sans tag H', () => {
    const config: WifiConfig = {
      ssid: 'GuestNetwork',
      encryption: 'nopass',
      hidden: false,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:S:GuestNetwork;T:nopass;;');
  });

  it('devrait formater un réseau ouvert masqué avec H:true', () => {
    const config: WifiConfig = {
      ssid: 'HiddenGuest',
      encryption: 'nopass',
      hidden: true,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:S:HiddenGuest;T:nopass;H:true;;');
  });

  it('devrait échapper rigoureusement les caractères spéciaux (\\ ; , : ") dans le SSID et le mot de passe', () => {
    const config: WifiConfig = {
      ssid: 'Net\\work;Name:Test,Quotes"Ok',
      encryption: 'WPA2',
      password: 'Pass\\word;123:456,Quotes"Ok',
      hidden: false,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe(
      'WIFI:S:Net\\\\work\\;Name\\:Test\\,Quotes\\"Ok;T:WPA;P:Pass\\\\word\\;123\\:456\\,Quotes\\"Ok;;'
    );
  });

  it('devrait purger les retours à la ligne (\\r, \\n) pour éviter la corruption de la trame', () => {
    const config: WifiConfig = {
      ssid: 'Bbox-Livebox\r\n',
      encryption: 'WPA2',
      password: 'Pass\nWord\r',
      hidden: false,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:S:Bbox-Livebox;T:WPA;P:PassWord;;');
  });

  it('devrait retomber sur le token WPA si l\'encryption n\'est pas spécifiée', () => {
    const config = {
      ssid: 'DefaultNet',
      password: 'mypass',
      hidden: false,
    } as unknown as WifiConfig;
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:S:DefaultNet;T:WPA;P:mypass;;');
  });
});

describe('escapeWifiString (Catégorie 2 - Test Unitaire)', () => {
  it('devrait retourner une chaîne vide si l\'entrée est vide ou null/undefined', () => {
    expect(escapeWifiString('')).toBe('');
  });

  it('devrait préfixer chaque caractère réservé d\'un antislash', () => {
    expect(escapeWifiString(';')).toBe('\\;');
    expect(escapeWifiString(':')).toBe('\\:');
    expect(escapeWifiString(',')).toBe('\\,');
    expect(escapeWifiString('"')).toBe('\\"');
    expect(escapeWifiString('\\')).toBe('\\\\');
  });
});

