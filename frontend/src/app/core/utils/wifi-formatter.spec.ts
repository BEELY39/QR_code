import { formatWifiPayload, escapeWifiString } from './wifi-formatter';
import { WifiConfig } from '../models/live-qr.model';

describe('formatWifiPayload (Catégorie 2 - Test Unitaire)', () => {
  it('devrait formater une connexion WPA visible standard sans le flag H:false', () => {
    const config: WifiConfig = {
      ssid: 'MyNetwork',
      encryption: 'WPA',
      password: 'MySuperPassword123!',
      hidden: false,
    };
    const result = formatWifiPayload(config);
    // CRITIQUE : Ne doit pas contenir H:false; pour compatibilité iOS Camera / Android
    expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:MySuperPassword123!;;');
  });

  it('devrait inclure H:true uniquement quand le réseau est masqué', () => {
    const config: WifiConfig = {
      ssid: 'HiddenNetwork',
      encryption: 'WPA',
      password: 'SecretPassword',
      hidden: true,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:T:WPA;S:HiddenNetwork;P:SecretPassword;H:true;;');
  });

  it('devrait formater une connexion WEP correctement', () => {
    const config: WifiConfig = {
      ssid: 'OldNetwork',
      encryption: 'WEP',
      password: 'WEPPassword',
      hidden: false,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:T:WEP;S:OldNetwork;P:WEPPassword;;');
  });

  it('devrait formater une connexion ouverte (nopass) sans tag P et sans tag H', () => {
    const config: WifiConfig = {
      ssid: 'GuestNetwork',
      encryption: 'nopass',
      hidden: false,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:T:nopass;S:GuestNetwork;;');
  });

  it('devrait formater un réseau ouvert masqué avec H:true', () => {
    const config: WifiConfig = {
      ssid: 'HiddenGuest',
      encryption: 'nopass',
      hidden: true,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:T:nopass;S:HiddenGuest;H:true;;');
  });

  it('devrait échapper rigoureusement les caractères spéciaux (\\ ; , : ") dans le SSID et le mot de passe', () => {
    const config: WifiConfig = {
      ssid: 'Net\\work;Name:Test,Quotes"Ok',
      encryption: 'WPA',
      password: 'Pass\\word;123:456,Quotes"Ok',
      hidden: false,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe(
      'WIFI:T:WPA;S:Net\\\\work\\;Name\\:Test\\,Quotes\\"Ok;P:Pass\\\\word\\;123\\:456\\,Quotes\\"Ok;;'
    );
  });

  it('devrait purger les retours à la ligne (\\r, \\n) pour éviter la corruption de la trame', () => {
    const config: WifiConfig = {
      ssid: 'Bbox-Livebox\r\n',
      encryption: 'WPA',
      password: 'Pass\nWord\r',
      hidden: false,
    };
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:T:WPA;S:Bbox-Livebox;P:PassWord;;');
  });

  it('devrait utiliser WPA par défaut si l\'encryption n\'est pas spécifiée', () => {
    const config = {
      ssid: 'DefaultNet',
      password: 'mypass',
      hidden: false,
    } as unknown as WifiConfig;
    const result = formatWifiPayload(config);
    expect(result).toBe('WIFI:T:WPA;S:DefaultNet;P:mypass;;');
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

