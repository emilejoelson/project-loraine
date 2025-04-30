export interface SignupRequest {
    email: string;
    password: string;
    confirmPassword: string;
    profileImage: string | null;
    cvFile: string | null;
    personalInfo: {
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
  }
  
  export interface Language {
    language: string;
    level?: string;
  }
  
  export interface Experience {
    position: string;
    company: string;
    startMonth: string;
    startYear: string;
    endMonth?: string;
    endYear?: string;
  }