'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Lock,
  Eye,
  FileText,
  UserCheck,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  CheckCircle2,
  Share2,
  Database,
  KeyRound,
  Users,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const isNe = language === 'ne';

  const lastUpdated = isNe ? '२०८१ फागुन' : 'February 2025';

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge={isNe ? 'कानूनी तथा सुरक्षा नीति' : 'Legal & Privacy Policy'}
        title={isNe ? 'गोपनीयता नीति (Privacy Policy)' : 'Privacy Policy'}
        subtitle={
          isNe
            ? 'हाई स्कूल युवा क्लब (High School Youth Club) मा तपाईंको व्यक्तिगत विवरण, गोपनीयता र सुरक्षाको पूर्ण संरक्षण।'
            : 'How High School Youth Club collects, protects, uses, and respects personal data across our community platform.'
        }
        breadcrumbs={[
          { label: isNe ? 'गोपनीयता नीति' : 'Privacy Policy' }
        ]}
      />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Quick Highlights Banner */}
        <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-red-500/5 via-card to-amber-500/5 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-600/10 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-heading text-foreground">
                  {isNe ? 'हाम्रो मुख्य गोपनीयता प्रतिबद्धता' : 'Our Privacy Commitment'}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-3.5 w-3.5" />
                  {isNe ? `पछिल्लो पटक अद्यावधिक: ${lastUpdated}` : `Last Updated: ${lastUpdated}`}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              <span>{isNe ? 'डाटा कहिल्यै बिक्री गरिँदैन' : 'We Never Sell Your Data'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-sm">
            <div className="flex items-start gap-3">
              <KeyRound className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">
                  {isNe ? 'इन्क्रिप्टेड पासवर्डहरू' : 'Encrypted Credentials'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isNe ? 'पासवर्डहरू सुरक्षित ह्यासिङ प्रविधिबाट मात्र भण्डारण हुन्छन्।' : 'Passwords are cryptographic hashes, never stored in plain text.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">
                  {isNe ? 'युवा तथा विद्यार्थीमैत्री' : 'Youth-Centered Safety'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isNe ? 'विद्यार्थी तथा नाबालिग सदस्यहरूको गोपनीयतामा विशेष सतर्कता।' : 'Protected community environment suitable for high school students.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <UserCheck className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">
                  {isNe ? 'पूर्ण नियन्त्रण र अधिकार' : 'Full User Control'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isNe ? 'आफ्नो प्रोफाइल विवरण परिवर्तन तथा खाता हटाउने सहज सुविधा।' : 'Update your profile anytime or request account deletion.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Overview and Purpose */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '१. संस्थाको परिचय र उद्देश्य (Organization & Purpose)' : '1. Organization & Purpose'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'हाई स्कूल युवा क्लबको परिचय र डिजिटल प्लेटफर्मको उद्देश्य' : 'Who we are and the scope of our community web portal'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe ? (
                <>
                  <strong>हाई स्कूल युवा क्लब (High School Youth Club)</strong>, गुलरिया, कृष्णपुर-५, कञ्चनपुर, सुदूरपश्चिम प्रदेश, नेपालमा अवस्थित एक सामाजिक तथा युवा सशक्तीकरण क्लब हो। यो वेबसाइट (
                  <span className="font-medium text-foreground">High School Youth Club Portal</span>) क्लबका सदस्यहरू, विद्यार्थीहरू, स्वयंसेवकहरू र स्थानीय समुदायलाई सूचना, कार्यक्रम सहभागिता, खेलकुद, सांस्कृतिक कार्यक्रम र युवा नेतृत्वका अवसरहरू आदानप्रदान गर्न सञ्चालन गरिएको हो।
                </>
              ) : (
                <>
                  <strong>High School Youth Club</strong> (located in Gulariya, Krishnapur-5, Kanchanpur, Sudurpashchim Province, Nepal) operates this website to serve students, young leaders, volunteers, and community members. Our portal facilitates transparent club notices, volunteer hours tracking, event registrations, community achievements, member directories, and direct inquiry communications.
                </>
              )}
            </p>
            <p>
              {isNe
                ? 'हामी हाम्रा सदस्यहरू र वेबसाइट प्रयोगकर्ताहरूको व्यक्तिगत जानकारीको सम्मान र सुरक्षा गर्न प्रतिबद्ध छौं। यस नीतिले हामीले कुन जानकारी संकलन गर्छौं, कसरी प्रयोग गर्छौं र कसरी सुरक्षित राख्छौं भन्ने स्पष्ट पार्दछ।'
                : 'We are committed to maintaining the trust of our community by protecting all personally identifiable information collected through our website, member registration forms, and digital ID card systems.'}
            </p>
          </CardContent>
        </Card>

        {/* Section 2: Information We Collect */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '२. हामीले संकलन गर्ने जानकारी (Information We Collect)' : '2. Information We Collect'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'वेबसाइट तथा खाता प्रयोग गर्दा संकलन हुने विवरणहरू' : 'Types of personal and technical data gathered through our platform'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe
                ? 'हामी केवल क्लब सञ्चालन, सदस्यता प्रमाणीकरण, र कार्यक्रम व्यवस्थापनका लागि आवश्यक विवरण मात्र संकलन गर्दछौं:'
                : 'We collect information directly provided by you, as well as necessary technical metadata required to securely deliver services:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-red-500" />
                  {isNe ? 'व्यक्तिगत तथा सदस्यता विवरण' : 'Member Profile Information'}
                </h4>
                <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 text-muted-foreground">
                  <li>{isNe ? 'पुरा नाम र इमेल ठेगाना' : 'Full name and email address'}</li>
                  <li>{isNe ? 'सम्पर्क फोन नम्बर / ह्वाट्सएप नम्बर' : 'Contact phone number / WhatsApp number'}</li>
                  <li>{isNe ? 'ठेगाना / वडा नम्बर (कृष्णपुर-५ तथा आसपास)' : 'Location / Ward (Krishnapur-5 & surrounding areas)'}</li>
                  <li>{isNe ? 'प्रोफाइल तस्वीर / फोटो र छोटो परिचय (Bio)' : 'Profile avatar image and biographical summary'}</li>
                  <li>{isNe ? 'विशिष्ट डिजिटल सदस्य परिचयपत्र नम्बर (Member ID: HSYC-KP5-XXXXXX)' : 'Unique Digital Member ID (e.g., HSYC-KP5-XXXXXX)'}</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  {isNe ? 'कार्यक्रम तथा सहभागिता तथ्याङ्क' : 'Club Activity & Service Records'}
                </h4>
                <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 text-muted-foreground">
                  <li>{isNe ? 'कार्यक्रम दर्ता तथा उपस्थिति अभिलेख' : 'Event registrations and verified attendance history'}</li>
                  <li>{isNe ? 'स्वयंसेवा घण्टा र योगदानहरू (Volunteer Hours)' : 'Earned volunteer service hours and community contributions'}</li>
                  <li>{isNe ? 'युवा नेतृत्व श्रेणी र क्लब उपलब्धिहरू' : 'Youth leadership rank and verified club achievements'}</li>
                  <li>{isNe ? 'समर्थन गरिएका परियोजनाहरू (Projects Backed)' : 'Community projects participated in or backed'}</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4 text-red-500" />
                  {isNe ? 'सम्पर्क तथा सोधपुछ विवरण' : 'Inquiries & Communications'}
                </h4>
                <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 text-muted-foreground">
                  <li>{isNe ? 'सम्पर्क फारम मार्फत पठाइएका सन्देश र विषय' : 'Messages, subjects, and questions sent via the Contact page'}</li>
                  <li>{isNe ? 'पासवर्ड रिसेट तथा सुरक्षा सूचना अनुरोधहरू' : 'Password reset requests and communication logs'}</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-red-500" />
                  {isNe ? 'सुरक्षा तथा प्राविधिक जानकारी' : 'Authentication & Security Data'}
                </h4>
                <ul className="list-disc list-inside text-xs sm:text-sm space-y-1 text-muted-foreground">
                  <li>{isNe ? 'सुरक्षित रूपमा ह्यासिङ गरिएको पासवर्ड (कहिले पनि प्लेनटेक्स्टमा होइन)' : 'Securely hashed authentication tokens (never plaintext)'}</li>
                  <li>{isNe ? 'लगइन भएको डिभाइस, ब्राउजर र सक्रिय सत्र (Active Session)' : 'Active session metadata (device, browser, sign-in time)'}</li>
                  <li>{isNe ? 'प्रशासनिक पारदर्शिताका लागि अडिट लग (Audit Logs)' : 'Administrative audit logs for security and accountability'}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: How We Use Information */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '३. जानकारीको प्रयोग (How We Use Your Information)' : '3. How We Use Your Information'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'संकलित जानकारी कुन प्रयोजनका लागि उपयोग गरिन्छ' : 'The legitimate community purposes for processing member information'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe
                ? 'हामी संकलित विवरणहरू देहायका वैध क्लब प्रयोजनका लागि मात्र प्रयोग गर्दछौं:'
                : 'We utilize collected information strictly for genuine community activities, membership management, and platform reliability:'}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <li className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/50 text-xs sm:text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{isNe ? 'सदस्यता खाता प्रमाणीकरण र डिजिटल आईडी कार्ड निर्माण।' : 'Account verification and digital member ID card generation.'}</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/50 text-xs sm:text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{isNe ? 'खेलकुद, तालिम तथा स्वयंसेवा कार्यक्रमहरूको व्यवस्थापन।' : 'Coordinating sports tournaments, workshops, and volunteer drives.'}</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/50 text-xs sm:text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{isNe ? 'स्वयंसेवा घण्टा र उपलब्धिहरूको वास्तविक गणना र सम्मान।' : 'Accurate tracking of volunteer service hours and youth awards.'}</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/50 text-xs sm:text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{isNe ? 'आधिकारिक क्लब सूचनाहरू, निर्णयहरू तथा कार्यक्रमको जानकारी सम्प्रेषण।' : 'Publishing official club notices, schedules, and bulletins.'}</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/50 text-xs sm:text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{isNe ? 'सोधपुछ सन्देशको प्रत्युत्तर र सामुदायिक समन्वय।' : 'Responding promptly to contact inquiries and member feedback.'}</span>
              </li>
              <li className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/20 border border-border/50 text-xs sm:text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{isNe ? 'प्लेटफर्म सुरक्षा, अनाधिकृत पहुँच रोकथाम र अडिट नियमन।' : 'Platform security monitoring, access auditing, and fraud prevention.'}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 4: Youth & Minors Privacy */}
        <Card className="border border-red-500/30 bg-card shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '४. युवा तथा विद्यार्थीहरूको गोपनीयता (Youth & Minors Privacy)' : '4. Youth & Minors Privacy Protection'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'हाई स्कूल विद्यार्थी तथा नाबालिगहरूको सुरक्षा नीति' : 'Dedicated safeguards for school students and teenage participants'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe ? (
                <>
                  हाई स्कूल युवा क्लब मूलतः <strong>हाई स्कूलका विद्यार्थीहरू, युवाहरू र किशोर-किशोरीहरूको</strong> चौतर्फी विकासका लागि स्थापित क्लब हो। तसर्थ, हामी कम उमेरका सदस्यहरूको गोपनीयतामा विशेष संवेदनशीलता अपनाउँछौं:
                </>
              ) : (
                <>
                  As an organization centered on <strong>high school students and youth leadership</strong>, we implement dedicated protective measures for younger participants:
                </>
              )}
            </p>
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60">
                <Shield className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">
                    {isNe ? 'अनावश्यक व्यक्तिगत विवरण संकलन नगर्ने' : 'Minimal Data Collection'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isNe
                      ? 'हामी विद्यार्थी सदस्यहरूबाट कुनै पनि अनावश्यक संवेदनशील व्यक्तिगत, वित्तीय वा गोपनीय जानकारी माग्दैनौं।'
                      : 'We collect only the bare minimum details necessary for club participation and leadership recognition.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60">
                <Users className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">
                    {isNe ? 'अभिभावक तथा शिक्षक समन्वय' : 'Parental / Guardian Cooperation'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isNe
                      ? '१८ वर्ष मुनिका विद्यार्थी सदस्यहरूलाई क्लबका बाह्य कार्यक्रमहरूमा सहभागिताका लागि अभिभावकको अनुमति लिन प्रोत्साहित गरिन्छ। अभिभावकले जुनसुकै बेला आफ्ना बालबालिकाको जानकारी समीक्षा वा हटाउन अनुरोध गर्न सक्नुहुन्छ।'
                      : 'Parents and guardians of student members may contact club leadership at any time to review, modify, or request deletion of their child’s profile or event records.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60">
                <Eye className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">
                    {isNe ? 'ग्यालरी तथा फोटो अपलोडमा सुरक्षा' : 'Responsible Media & Photo Gallery Policy'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isNe
                      ? 'क्लबका कार्यक्रम तथा खेलकुदका फोटोहरू सार्वजनिक गर्दा मर्यादा र सुरक्षाको पूर्ण ख्याल राखिन्छ। कुनै विद्यार्थी वा अभिभावकले आफ्नो फोटो हटाउन चाहेमा तत्काल हटाइनेछ।'
                      : 'Event photos published in our community gallery celebrate sportsmanship and community drives. If any student or guardian requests removal of a photo, we honor it promptly.'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Data Security & Privacy Controls */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                5
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '५. डाटा सुरक्षा र प्रयोगकर्ता नियन्त्रण (Security & Controls)' : '5. Data Security & User Privacy Controls'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'हाम्रो प्राविधिक सुरक्षा संरचना र तपाईंको खाता नियन्त्रण' : 'Technical safeguards and self-service account privacy controls'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe
                ? 'तपाईंको डाटाको सुरक्षाका लागि हामी आधुनिक इन्क्रिप्सन र भूमिका-आधारित पहुँच नियन्त्रण (RBAC) प्रयोग गर्दछौं:'
                : 'We adopt modern web security architectures to defend against unauthorized access, leaks, and malicious tampering:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
                <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4 text-red-500" />
                  {isNe ? 'क्रिप्टोग्राफिक पासवर्ड ह्यासिङ' : 'Password Protection'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isNe
                    ? 'तपाईंको पासवर्ड कहिले पनि सादा अक्षर (plaintext) मा देख्न वा भण्डारण गर्न सकिँदैन। प्रणालीले केवल सुरक्षित एकतर्फी ह्यासिङ प्रयोग गर्दछ।'
                    : 'All passwords undergo strong one-way cryptographic hashing. Plaintext passwords are never visible to admins or stored in databases.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
                <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4 text-red-500" />
                  {isNe ? 'सक्रिय सत्र (Active Session) ट्र्याकिङ' : 'Active Session Visibility'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isNe
                    ? 'प्रयोगकर्ताहरूले प्रोफाइल सुरक्षा खण्डमा आफ्नो हालको डिभाइस, ब्राउजर र लगइन समय हेर्न सक्छन्।'
                    : 'Members can inspect their authenticated device, browser type, and sign-in timestamps directly inside Profile → Security.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
                <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-red-500" />
                  {isNe ? 'सुरक्षित अडिट लगिङ (Audit Logging)' : 'Role-Based Auditing'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isNe
                    ? 'कुनै पनि प्रशासनिक कार्य (सदस्य प्रमाणीकरण, सूचना प्रकाशन, खाता व्यवस्थापन) को पारदर्शिताका लागि अडिट लग सुरक्षित राखिन्छ।'
                    : 'Administrative operations are automatically logged with timestamp and actor ID to ensure complete operational accountability.'}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/30 space-y-2">
                <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-red-500" />
                  {isNe ? 'गोपनीयता प्राथमिकता (Privacy Settings)' : 'Public vs Private Profile'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isNe
                    ? 'सदस्यहरूले आफ्नो प्रोफाइल सम्पादन पृष्ठबाट आफ्नो सम्पर्क नम्बर तथा विवरण सार्वजनिक वा निजी राख्ने रोज्न सक्छन्।'
                    : 'Members have granular control over their profile visibility and contact information preferences.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Third-Party & Sharing */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                6
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '६. तेस्रो पक्ष र डाटा साझेदारी (Data Sharing & Third Parties)' : '6. Third Parties & Data Sharing'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'हामी कसैसँग पनि तपाईंको डाटा बेच्दैनौं' : 'Our strict no-sale policy and essential service infrastructure'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe ? (
                <>
                  <strong className="text-foreground">हाम्रो स्पष्ट प्रतिबद्धता:</strong> हामी प्रयोगकर्ताहरूको कुनै पनि व्यक्तिगत जानकारी कुनै पनि विज्ञापनदाता वा व्यावसायिक कम्पनीलाई बिक्री, भाडा वा व्यापार गर्दैनौं।
                </>
              ) : (
                <>
                  <strong className="text-foreground">Our Uncompromising Policy:</strong> We do not sell, rent, monetize, or trade your personal data with any commercial advertisers or data brokers.
                </>
              )}
            </p>
            <p>
              {isNe
                ? 'वेबसाइट सञ्चालन गर्न आवश्यक पर्ने सीमित प्राविधिक सेवा प्रदायकहरूसँग मात्र सुरक्षित रूपमा डाटा अन्तरक्रिया हुन्छ:'
                : 'Data is processed only through trusted technical infrastructure necessary to maintain platform availability:'}
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm pl-2">
              <li>
                <strong>{isNe ? 'क्लाउड डाटाबेस तथा होस्टिङ:' : 'Cloud Database & Hosting:'}</strong>{' '}
                {isNe ? 'सुरक्षित PostgreSQL तथा सर्भर पूर्वाधार।' : 'Enterprise-grade encrypted PostgreSQL storage.'}
              </li>
              <li>
                <strong>{isNe ? 'ट्रान्ज्याक्सनल इमेल सेवा:' : 'Transactional Email Delivery:'}</strong>{' '}
                {isNe ? 'पासवर्ड रिसेट र सुरक्षा अलर्ट पठाउनका लागि मात्र।' : 'Used strictly for password resets and verification notices.'}
              </li>
              <li>
                <strong>{isNe ? 'कानूनी दायित्व:' : 'Legal Compliance:'}</strong>{' '}
                {isNe ? 'नेपालको विद्यमान कानून वा आधिकारिक न्यायिक आदेश अनुसार आवश्यक परेको अवस्थामा मात्र।' : 'Disclosed only if strictly mandated by applicable laws of Nepal.'}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 7: User Rights & Data Deletion */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                7
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '७. तपाईंको अधिकार र डाटा हटाउने प्रक्रिया (Your Rights & Deletion)' : '7. Your Rights & Data Deletion'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'आफ्नो विवरण हेर्ने, सच्याउने र हटाउने अधिकार' : 'How to access, rectify, or request complete removal of your records'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe
                ? 'हाम्रो क्लबका प्रत्येक सदस्य तथा प्रयोगकर्तालाई निम्न अधिकारहरू प्राप्त छन्:'
                : 'Every registered member and website visitor retains comprehensive rights concerning their personal data:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-foreground">{isNe ? '१. हेर्ने र सच्याउने अधिकार' : '1. Access & Rectification'}</p>
                <p className="text-muted-foreground">{isNe ? 'आफ्नो प्रोफाइल र विवरणहरू जुनसुकै बेला सच्याउन सकिन्छ।' : 'View and update your personal info via Edit Profile.'}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-foreground">{isNe ? '२. खाता हटाउने अधिकार' : '2. Complete Erasure'}</p>
                <p className="text-muted-foreground">{isNe ? 'क्लब प्रशासनलाई अनुरोध गरी आफ्नो खाता र व्यक्तिगत विवरण मेटाउन सकिन्छ।' : 'Request complete deletion of your account and inquiry data.'}</p>
              </div>
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-foreground">{isNe ? '३. सहमति फिर्ता लिने अधिकार' : '3. Withdrawal of Consent'}</p>
                <p className="text-muted-foreground">{isNe ? 'कार्यक्रम वा स्वयंसेवा सूचनाहरूबाट जुनसुकै बेला बाहिरिन सकिन्छ।' : 'Opt out of optional notifications and public listings anytime.'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Contact & Inquiries */}
        <Card className="border border-border/80 bg-gradient-to-br from-card to-muted/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                8
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '८. गोपनीयता सम्पर्क तथा समन्वय (Contact Us for Privacy)' : '8. Privacy Office & Inquiries'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'गोपनीयता नीति सम्बन्धी कुनै प्रश्न वा सहयोगका लागि' : 'Reach out to club administration for privacy inquiries or requests'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe
                ? 'यदि तपाईंसँग हाम्रो गोपनीयता नीति, तपाईंको डाटाको प्रयोग वा खाता मेटाउने सम्बन्धमा कुनै प्रश्न वा जिज्ञासा भएमा कृपया क्लबको कार्यालयमा सम्पर्क गर्नुहोस्:'
                : 'If you have questions regarding this Privacy Policy, wish to exercise your data protection rights, or want to report a concern, please contact our administration:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-card">
                <MapPin className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm">{isNe ? 'क्लब कार्यालय' : 'Club Office'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isNe ? 'गुलरिया, कृष्णपुर-५, कञ्चनपुर, नेपाल' : 'Gulariya, Krishnapur-5, Kanchanpur, Sudurpashchim, Nepal'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-card">
                <Mail className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm">{isNe ? 'इमेल सम्पर्क' : 'Email Address'}</p>
                  <a
                    href="mailto:hsyc172@gmail.com"
                    className="text-xs text-red-600 dark:text-red-400 font-medium hover:underline mt-0.5 block"
                  >
                    hsyc172@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-card">
                <Phone className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-sm">{isNe ? 'फोन / ह्वाट्सएप' : 'Phone / WhatsApp'}</p>
                  <a
                    href="tel:9748886690"
                    className="text-xs text-foreground font-medium hover:underline mt-0.5 block"
                  >
                    +977 9748886690
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white font-semibold">
                <Link href="/contact">
                  <span>{isNe ? 'सम्पर्क फारममा जानुहोस्' : 'Visit Contact Page'}</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/terms-and-conditions">
                  <span>{isNe ? 'नियम तथा सर्तहरू पढ्नुहोस्' : 'View Terms & Conditions'}</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
