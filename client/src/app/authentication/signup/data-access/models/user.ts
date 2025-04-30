import { Role } from '../../../data-access/models/auth.response';
import { Experience, Language} from './signup';

export interface User {
  id: string;
  email: string;
  role?: string;
  roles?: Role[];
  personalInfo?: {
    civility: string;
    firstName: string;
    lastName: string;
    telephone: string;
  };
  professionalInfo?: {
    currentPosition?: string;
    desiredPosition?: string;
    enterprise?: string;
    hasRemoteExperience?: boolean;
    experiences?: Experience[];
  };
  academicInfo?: {
    formation?: {
      level?: string;
      languages?: Language[];
    };
    motivation?: string;
  };
  profileImage?: string;
  cvFile?: string;
}