import { first } from 'lodash';

/**
 * Parse service name from LDAP DN format.
 *
 * @param dn "CN=SolrAdmin,OU=Service,DC=ideawise,DC=24z,DC=de"
 */
export function parseNameFromDN(dn: string): string {
  return first(dn.split(',')).split('=')[1];
}

/**
 * Parse services.
 *
 * @param services
 * @param flatten
 */
export function parseServices(services: Array<any>, flatten: boolean = false): Array<Service> {
  if (!services || Array.isArray(services) && services.length === 0) {
    return [];
  }

  const parsed: Service[] = [];

  services.forEach((service) => {
    const children = parseServices(service.children);
    const s = {
      name: parseNameFromDN(service.name),
      children,
      icon: service.description.iconPath,
      image: service.description.imgPath,
      url: service.urlStr,
    };

    parsed.push(s);
    if (flatten) {
      parsed.push(...children);
    }
  });

  return parsed;
}
