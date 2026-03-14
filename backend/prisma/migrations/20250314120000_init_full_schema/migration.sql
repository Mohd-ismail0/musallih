-- Enable PostGIS for geo queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "dob" DATE,
    "gender" TEXT,
    "marital_status" TEXT,
    "city_id" TEXT,
    "education_level" TEXT,
    "field_of_study" TEXT,
    "occupation" TEXT,
    "income_range" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Family" (
    "id" TEXT NOT NULL,
    "primary_user_id" TEXT NOT NULL,
    "family_name" TEXT NOT NULL,
    "address" TEXT,
    "city_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL,
    "family_id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "dob" DATE,
    "gender" TEXT,
    "education_level" TEXT,
    "occupation" TEXT,
    "income_range" TEXT,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SchoolOfThought" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "SchoolOfThought_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserSchool" (
    "user_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserSchool_pkey" PRIMARY KEY ("user_id","school_id")
);

CREATE TABLE "FamilyMemberSchool" (
    "family_member_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FamilyMemberSchool_pkey" PRIMARY KEY ("family_member_id","school_id")
);

CREATE TABLE "Authority" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "parent_id" TEXT,
    "geo_boundary" TEXT,

    CONSTRAINT "Authority_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuthorityAdmin" (
    "id" TEXT NOT NULL,
    "authority_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "AuthorityAdmin_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "geo_location" TEXT,
    "authority_id" TEXT NOT NULL,
    "verification_status" TEXT NOT NULL,
    "primary_contact" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrganizationTeam" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permissions_scope" TEXT,

    CONSTRAINT "OrganizationTeam_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrganizationSchool" (
    "organization_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationSchool_pkey" PRIMARY KEY ("organization_id","school_id")
);

CREATE TABLE "MasjidPrayerConfig" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "calculation_method" TEXT NOT NULL,
    "fajr_angle" DOUBLE PRECISION NOT NULL,
    "isha_angle" DOUBLE PRECISION NOT NULL,
    "asr_method" TEXT NOT NULL,
    "high_latitude_rule" TEXT,

    CONSTRAINT "MasjidPrayerConfig_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MasjidPrayerTime" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "fajr_start" TIMESTAMP(3) NOT NULL,
    "sunrise" TIMESTAMP(3) NOT NULL,
    "dhuhr" TIMESTAMP(3) NOT NULL,
    "asr" TIMESTAMP(3) NOT NULL,
    "maghrib" TIMESTAMP(3) NOT NULL,
    "isha" TIMESTAMP(3) NOT NULL,
    "fajr_end" TIMESTAMP(3) NOT NULL,
    "isha_end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasjidPrayerTime_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "IslamicCalendarDay" (
    "id" TEXT NOT NULL,
    "gregorian_date" DATE NOT NULL,
    "hijri_date" TEXT NOT NULL,
    "hijri_month" INTEGER NOT NULL,
    "hijri_year" INTEGER NOT NULL,
    "is_ramadan" BOOLEAN NOT NULL DEFAULT false,
    "islamic_events" TEXT,

    CONSTRAINT "IslamicCalendarDay_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConsentProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "scope_json" TEXT NOT NULL,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_to" TIMESTAMP(3),

    CONSTRAINT "ConsentProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AccessLog" (
    "id" TEXT NOT NULL,
    "actor_user_id" TEXT NOT NULL,
    "target_user_id" TEXT,
    "organization_id" TEXT,
    "action" TEXT NOT NULL,
    "accessed_fields" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "appointment_enabled" BOOLEAN NOT NULL DEFAULT false,
    "request_enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "recurrence" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL,
    "requester_user_id" TEXT NOT NULL,
    "family_id" TEXT,
    "organization_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "urgency_level" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "service_request_id" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "assigned_to_id" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "authority_id" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "target_scope" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DonationCampaign" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "goal_amount" DECIMAL(14,2) NOT NULL,
    "current_amount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,

    CONSTRAINT "DonationCampaign_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Webinar" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "live_url" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER,

    CONSTRAINT "Webinar_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BusinessProfile" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "documents" TEXT,

    CONSTRAINT "BusinessProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdCampaign" (
    "id" TEXT NOT NULL,
    "advertiser_org_id" TEXT NOT NULL,
    "geo_scope" TEXT NOT NULL,
    "budget" DECIMAL(14,2) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',

    CONSTRAINT "AdCampaign_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AdEvent" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "billable_amount" DECIMAL(14,4) NOT NULL,
    "geo_scope" TEXT NOT NULL,
    "jurisdiction_ids" TEXT,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RevenueLedger" (
    "id" TEXT NOT NULL,
    "ad_event_id" TEXT NOT NULL,
    "gross_amount" DECIMAL(14,4) NOT NULL,
    "platform_fee" DECIMAL(14,4) NOT NULL,
    "local_pool" DECIMAL(14,4) NOT NULL,
    "authority_pool" DECIMAL(14,4) NOT NULL,
    "settlement_status" TEXT NOT NULL DEFAULT 'PENDING',
    "settled_at" TIMESTAMP(3),

    CONSTRAINT "RevenueLedger_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RevenueDistribution" (
    "id" TEXT NOT NULL,
    "ledger_id" TEXT NOT NULL,
    "recipient_type" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "amount" DECIMAL(14,4) NOT NULL,
    "period" TEXT NOT NULL,

    CONSTRAINT "RevenueDistribution_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OAuthClient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "redirect_uris" TEXT NOT NULL,
    "scopes" TEXT,

    CONSTRAINT "OAuthClient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OAuthToken" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "scopes" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OAuthToken_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WebhookSubscription" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "callback_url" TEXT NOT NULL,
    "events" TEXT NOT NULL,

    CONSTRAINT "WebhookSubscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AuthorityAdmin_authority_id_user_id_key" ON "AuthorityAdmin"("authority_id", "user_id");
CREATE UNIQUE INDEX "OrganizationTeam_organization_id_user_id_key" ON "OrganizationTeam"("organization_id", "user_id");
CREATE UNIQUE INDEX "MasjidPrayerConfig_organization_id_key" ON "MasjidPrayerConfig"("organization_id");
CREATE UNIQUE INDEX "MasjidPrayerTime_organization_id_date_key" ON "MasjidPrayerTime"("organization_id", "date");
CREATE UNIQUE INDEX "IslamicCalendarDay_gregorian_date_key" ON "IslamicCalendarDay"("gregorian_date");
CREATE UNIQUE INDEX "ConsentProfile_user_id_organization_id_key" ON "ConsentProfile"("user_id", "organization_id");
CREATE UNIQUE INDEX "Appointment_service_request_id_key" ON "Appointment"("service_request_id");
CREATE UNIQUE INDEX "BusinessProfile_organization_id_key" ON "BusinessProfile"("organization_id");

ALTER TABLE "Family" ADD CONSTRAINT "Family_primary_user_id_fkey" FOREIGN KEY ("primary_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "UserSchool" ADD CONSTRAINT "UserSchool_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserSchool" ADD CONSTRAINT "UserSchool_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "SchoolOfThought"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FamilyMemberSchool" ADD CONSTRAINT "FamilyMemberSchool_family_member_id_fkey" FOREIGN KEY ("family_member_id") REFERENCES "FamilyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FamilyMemberSchool" ADD CONSTRAINT "FamilyMemberSchool_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "SchoolOfThought"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Authority" ADD CONSTRAINT "Authority_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Authority"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuthorityAdmin" ADD CONSTRAINT "AuthorityAdmin_authority_id_fkey" FOREIGN KEY ("authority_id") REFERENCES "Authority"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuthorityAdmin" ADD CONSTRAINT "AuthorityAdmin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_authority_id_fkey" FOREIGN KEY ("authority_id") REFERENCES "Authority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrganizationTeam" ADD CONSTRAINT "OrganizationTeam_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganizationTeam" ADD CONSTRAINT "OrganizationTeam_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganizationSchool" ADD CONSTRAINT "OrganizationSchool_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrganizationSchool" ADD CONSTRAINT "OrganizationSchool_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "SchoolOfThought"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MasjidPrayerConfig" ADD CONSTRAINT "MasjidPrayerConfig_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MasjidPrayerTime" ADD CONSTRAINT "MasjidPrayerTime_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConsentProfile" ADD CONSTRAINT "ConsentProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConsentProfile" ADD CONSTRAINT "ConsentProfile_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AccessLog" ADD CONSTRAINT "AccessLog_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Service" ADD CONSTRAINT "Service_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_requester_user_id_fkey" FOREIGN KEY ("requester_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_service_request_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "ServiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "OrganizationTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DonationCampaign" ADD CONSTRAINT "DonationCampaign_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Webinar" ADD CONSTRAINT "Webinar_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BusinessProfile" ADD CONSTRAINT "BusinessProfile_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdCampaign" ADD CONSTRAINT "AdCampaign_advertiser_org_id_fkey" FOREIGN KEY ("advertiser_org_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AdEvent" ADD CONSTRAINT "AdEvent_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "AdCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RevenueLedger" ADD CONSTRAINT "RevenueLedger_ad_event_id_fkey" FOREIGN KEY ("ad_event_id") REFERENCES "AdEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RevenueDistribution" ADD CONSTRAINT "RevenueDistribution_ledger_id_fkey" FOREIGN KEY ("ledger_id") REFERENCES "RevenueLedger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OAuthToken" ADD CONSTRAINT "OAuthToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OAuthToken" ADD CONSTRAINT "OAuthToken_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "OAuthClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WebhookSubscription" ADD CONSTRAINT "WebhookSubscription_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
