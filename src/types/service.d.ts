declare interface Service {
  name: string;
  url: string;
  icon: string;
  image: string;
  children?: Array<Service>;
}