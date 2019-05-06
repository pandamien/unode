import { expect } from 'chai';
import { parseNameFromDN, parseServices } from '../src/utils/services';
import { objToString } from '../src/utils';

describe('Testing utilities.', () => {
  it('should parse name correctly', () => {
    const DN = 'CN=name,OU=Service,DC=ideawise,DC=24z,DC=de';
    expect(parseNameFromDN(DN)).to.equal('name');
  });

  it('should parse services correctly', () => {
    const raw = [
      {
        'name': 'CN=Easytour,OU=Service,DC=ideawise,DC=24z,DC=de',
        'children': [],
        'urlStr': '',
        'description': {
          'iconPath': '',
          'imgPath': '',
          'displayIndex': 0
        }
      },
      {
        'name': 'CN=ChatService,OU=Service,DC=ideawise,DC=24z,DC=de',
        'children': [{
          'name': 'CN=PoppenChatService,OU=Service,DC=ideawise,DC=24z,DC=de',
          'children': [],
          'urlStr': '',
          'description': {
            'iconPath': '',
            'imgPath': '',
            'displayIndex': 0
          }
        }],
        'urlStr': '',
        'description': {
          'iconPath': '',
          'imgPath': '',
          'displayIndex': 0
        }
      },
    ];

    const services = parseServices(raw);

    expect(services.length).to.eql(raw.length);
    services.forEach((service, key) => {
      expect(service).to.has.keys(['name', 'url', 'image', 'icon', 'children']);
      expect(service.children.length).to.eql(raw[key].children.length);
      if (service.children.length) {
        service.children.forEach(child => {
          expect(child).to.has.keys(['name', 'url', 'image', 'icon', 'children']);
        });
      }
    });
  });

  it('should convert object to string rightly.', () => {
    const obj = { a: 1, b: () => {}, c: [0, 2, { ff: 123 }], d: { e: undefined } };

    expect(objToString(obj)).to.equal('{ a: 1, b: (function), c: [0, 2, { ff: 123 }], d: { e: (undefined) } }');
  });
});
