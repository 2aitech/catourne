export type Role = "performer" | "recruiter" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};

export type PerformerProfile = {
  user_id: string;
  stage_name: string;
  city: string;
  bio: string;
  specialty: string;
  phone: string;
  height_cm: string;
  weight_kg: string;
  neck_circumference_cm: string;
  pant_length_cm: string;
  head_circumference_cm: string;
  chest_circumference_cm: string;
  shoe_size: string;
  languages: string[];
  photo_url: string;
  completion_score: number;
};

export type Offer = {
  id: string;
  recruiter_user_id: string;
  title: string;
  project_type: string;
  description: string;
  city: string;
  deadline_at: string;
  status: string;
  applications_count: number;
};

export type PerformerApplication = {
  id: string;
  offer_id: string;
  offer_title: string;
  offer_city: string;
  status: string;
  motivation_text: string;
};

export type RecruiterApplication = {
  id: string;
  performer_user_id: string;
  stage_name: string;
  city: string;
  specialty: string;
  completion_score: number;
  status: string;
  motivation_text: string;
};

export type ReportItem = {
  id: string;
  reporter_email: string;
  target_type: string;
  target_id: string;
  reason: string;
  status: string;
  created_at: string;
};

export type PerformerProfileInput = {
  stage_name: string;
  city: string;
  specialty: string;
  languages: string[];
  phone: string;
  height_cm: string;
  weight_kg: string;
  neck_circumference_cm: string;
  pant_length_cm: string;
  head_circumference_cm: string;
  chest_circumference_cm: string;
  shoe_size: string;
  photo_url: string;
  bio: string;
};

export type OfferInput = {
  title: string;
  project_type: string;
  city: string;
  deadline_at_local: string;
  description: string;
};

export type ReportInput = {
  target_type: string;
  target_id: string;
  reason: string;
};
