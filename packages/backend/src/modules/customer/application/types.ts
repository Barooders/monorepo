type HasuraEventPayload<NewObjectType, OldObjectType = NewObjectType> = {
  event: {
    session_variables: unknown;
    op: 'INSERT' | 'UPDATE' | 'DELETE';
    data: {
      old: OldObjectType | null;
      new: NewObjectType;
    };
    trace_context: unknown;
  };
  created_at: string;
  id: string;
  delivery_info: {
    max_retries: number;
    current_retry: number;
  };
  trigger: {
    name: string;
  };
  table: {
    schema: string;
    name: string;
  };
};

type UserType = {
  email: string;
  display_name: string;
  email_verified: boolean;
  phone_number: string | null;
  disabled: boolean;
  last_seen: string | null;
  locale: string;
  otp_hash_expires_at: string;
  otp_method_last_used: string | null;
  phone_number_verified: boolean;
  ticket: string;
  webauthn_current_challenge: string | null;
  updated_at: string;
  new_email: string | null;
  password_hash: string;
  created_at: string;
  metadata: {
    lastName: string;
    firstName: string;
  };
  id: string;
  avatar_url: string;
  default_role: string;
  active_mfa_type: string | null;
  otp_hash: string | null;
  totp_secret: string | null;
  is_anonymous: boolean;
  ticket_expires_at: string;
};

export type SignupEventPayload = HasuraEventPayload<UserType, null>;
