import ICclose from "../assets/icons/ICclose.svg";
import ICdashboard from "../assets/icons/ICdashboard.svg";
import ICdashboard_ from "../assets/icons/ICdashboard_.svg";
import ICusers from "../assets/icons/ICusers.svg";
import ICusers_ from "../assets/icons/ICusers_.svg";
import ICvalidator from "../assets/icons/ICvalidator.svg";
import ICvalidator_ from "../assets/icons/ICvalidator_.svg";
import IClogout from "../assets/icons/IClogout.svg";
import IClogout1 from "../assets/icons/IClogout1.svg";

import BGlogin from "../assets/images/BGlogin.webp";
import BGlogin2 from "../assets/images/BGlogin2.webp";

import LOGOapp from "../assets/logos/LOGOnetwork.svg";
import LOGOappfull from "../assets/logos/LOGOnetwork_.svg";

export { BGlogin };

export class IC {
  static dashboard = ICdashboard;
  static dashboard_ = ICdashboard_;
  static users = ICusers;
  static users_ = ICusers_;
  static validator = ICvalidator;
  static validator_ = ICvalidator_;

  static close = ICclose;
  static logout = IClogout;
  static logout1 = IClogout1;
}

export class BG {
  static login = BGlogin;
  static login2 = BGlogin2;
}

export class Logo {
  static app = LOGOapp;
  static appFull = LOGOappfull;
}
