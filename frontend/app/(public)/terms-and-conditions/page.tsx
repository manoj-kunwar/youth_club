'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  ShieldCheck,
  Scale,
  Users,
  AlertTriangle,
  Award,
  CheckCircle2,
  Lock,
  MessageSquare,
  HelpCircle,
  MapPin,
  Mail,
  Phone,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function TermsAndConditionsPage() {
  const { language } = useLanguage();
  const isNe = language === 'ne';

  const lastUpdated = isNe ? '२०८१ फागुन' : 'February 2025';

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge={isNe ? 'कानूनी तथा सर्त नियमावली' : 'Terms of Service & Rules'}
        title={isNe ? 'नियम तथा सर्तहरू (Terms & Conditions)' : 'Terms & Conditions'}
        subtitle={
          isNe
            ? 'हाई स्कूल युवा क्लब (High School Youth Club) को अनलाइन प्लेटफर्म, सदस्यता, र कार्यक्रम सहभागिताका नियमहरू।'
            : 'Rules, member responsibilities, and community standards governing the use of High School Youth Club services.'
        }
        breadcrumbs={[
          { label: isNe ? 'नियम तथा सर्तहरू' : 'Terms & Conditions' }
        ]}
      />

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Quick Summary Banner */}
        <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-red-500/5 via-card to-amber-500/5 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-600/10 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center shrink-0">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-heading text-foreground">
                  {isNe ? 'सामुदायिक आचारसंहिता तथा सर्तहरूको सार' : 'Community Standards & Principles'}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Clock className="h-3.5 w-3.5" />
                  {isNe ? `लागू मिति: ${lastUpdated}` : `Effective Date: ${lastUpdated}`}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>{isNe ? 'पारदर्शी तथा सुरक्षित समुदाय' : 'Safe & Transparent Community'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-sm">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">
                  {isNe ? 'सभ्य तथा सम्मानजनक व्यवहार' : 'Mutual Respect'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isNe ? 'सबै सदस्यहरूबीच भाइचारा, अनुशासन र सम्मान अनिवार्य छ।' : 'Zero tolerance for harassment, hate speech, or misconduct.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">
                  {isNe ? 'वास्तविक सहभागिता र प्रमाणीकरण' : 'Genuine Participation'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isNe ? 'स्वयंसेवा घण्टा र उपलब्धिहरू वास्तविक योगदानमा आधारित हुन्छन्।' : 'Volunteer hours and awards reflect authentic contributions.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">
                  {isNe ? 'खाता तथा डिजिटल सुरक्षा' : 'Account Responsibility'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isNe ? 'आफ्नो लगइन विवरण सुरक्षित राख्ने दायित्व सदस्यको हुनेछ।' : 'Members are responsible for keeping credentials secure.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Acceptance of Terms */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '१. सर्तहरूको स्वीकृति (Acceptance of Terms)' : '1. Acceptance of Terms'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'वेबसाइट तथा सेवा प्रयोगका आधारभूत सर्तहरू' : 'Your legal agreement to abide by club rules when using this platform'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe ? (
                <>
                  हाई स्कूल युवा क्लब (High School Youth Club) को वेबसाइट, सदस्य पोर्टल र अनलाइन सेवाहरू प्रयोग गरेर, तपाईं यी नियम तथा सर्तहरू र हाम्रो{' '}
                  <Link href="/privacy-policy" className="text-red-600 dark:text-red-400 font-medium hover:underline">
                    गोपनीयता नीति (Privacy Policy)
                  </Link>{' '}
                  मान्न पूर्ण रूपमा सहमत हुनुहुन्छ। यदि तपाईं यी नियमहरूसँग सहमत हुनुहुन्न भने कृपया यो वेबसाइट प्रयोग नगर्नुहोला।
                </>
              ) : (
                <>
                  By accessing, browsing, or registering on the High School Youth Club website and portal, you agree to comply with and be bound by these Terms and Conditions and our{' '}
                  <Link href="/privacy-policy" className="text-red-600 dark:text-red-400 font-medium hover:underline">
                    Privacy Policy
                  </Link>
                  . If you do not agree to these terms, you should not access or use the platform.
                </>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Section 2: Eligibility & Membership */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '२. सदस्यता र योग्यता (Eligibility & Membership)' : '2. Eligibility & Membership'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'क्लबमा आबद्ध हुन र खाता खोल्नका लागि योग्यता' : 'Requirements for becoming a member of High School Youth Club'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isNe
                    ? 'सदस्यता हाई स्कूलका विद्यार्थीहरू, युवाहरू, पूर्व विद्यार्थीहरू, स्वयंसेवकहरू र कृष्णपुर तथा कञ्चनपुर क्षेत्रका समुदाय सदस्यहरूका लागि खुला छ।'
                    : 'Membership is open to high school students, young community members, alumni, and volunteers in Krishnapur and surrounding districts.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isNe
                    ? 'खाता खोल्दा र प्रोफाइल भर्दा सहि, सत्य र यथार्थ जानकारी दिनु अनिवार्य छ। अर्काको नाम वा गलत विवरण प्रयोग गर्न पाइने छैन।'
                    : 'Members must provide accurate, complete, and truthful information during registration. Impersonation of others is strictly forbidden.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isNe
                    ? 'प्रत्येक सदस्यलाई एक अद्वितीय सदस्यता नम्बर (Unique Member ID, जस्तै: HSYC-KP5-XXXXXX) प्रदान गरिन्छ, जुन गैर-हस्तान्तरणीय हुन्छ।'
                    : 'Every member receives an auto-generated unique Member ID (e.g. HSYC-KP5-XXXXXX) that cannot be transferred or shared with others.'}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Section 3: Community Guidelines & Code of Conduct */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '३. सामुदायिक आचारसंहिता (Community Code of Conduct)' : '3. Community Code of Conduct'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'सबै सदस्यहरूले पालना गर्नुपर्ने अनुशासन र नियमहरू' : 'Behavioral standards expected from every member and participant'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe
                ? 'हाई स्कूल युवा क्लब एक सकारात्मक, उत्साहजनक र समावेशी वातावरण निर्माण गर्न प्रतिबद्ध छ। देहायका कार्यहरू पूर्ण रूपमा निषेधित छन्:'
                : 'To maintain a welcoming, productive, and safe youth environment, the following actions are strictly prohibited:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  {isNe ? 'गालीगलौज र दुर्व्यवहार निषेध' : 'No Harassment or Bullying'}
                </p>
                <p className="text-muted-foreground">
                  {isNe
                    ? 'कुनै पनि सदस्य वा समुदायका व्यक्तिमाथि अपमानजनक, घृणास्पद वा भेदभावपूर्ण व्यवहार गर्न पाइँदैन।'
                    : 'Harassment, hate speech, bullying, or derogatory language towards any member will result in immediate suspension.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  {isNe ? 'गलत सूचना तथा अफवाह निषेध' : 'No False Information'}
                </p>
                <p className="text-muted-foreground">
                  {isNe
                    ? 'क्लब वा कार्यक्रमका बारेमा भ्रामक, गलत वा झुटा सूचना फैलाउन पाइने छैन।'
                    : 'Spreading misleading notices, falsifying volunteer hours, or providing fake achievements is prohibited.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  {isNe ? 'प्राविधिक आक्रमण निषेध' : 'No Hacking or Abuse'}
                </p>
                <p className="text-muted-foreground">
                  {isNe
                    ? 'वेबसाइटमा साइबर आक्रमण, स्क्र्यापिङ वा सुरक्षा कमजोरीको दुरुपयोग गर्न पाइँदैन।'
                    : 'Attempting unauthorized access, injecting malware, or attempting SQL/XSS attacks is subject to legal action.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  {isNe ? 'व्यावसायिक स्पाम निषेध' : 'No Unauthorized Commercial Ads'}
                </p>
                <p className="text-muted-foreground">
                  {isNe
                    ? 'क्लबको प्लेटफर्मलाई अनुमति बिना व्यावसायिक विज्ञापन वा स्पामिङका लागि प्रयोग गर्न पाइँदैन।'
                    : 'Unapproved promotional campaigns, unauthorized sales, or spam messages are not permitted.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Account Responsibilities & Security */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '४. खाता सुरक्षा र जिम्मेवारी (Account Responsibilities)' : '4. Account Responsibilities & Security'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'तपाईंको व्यक्तिगत लगइन र खाताको सुरक्षा' : 'Your responsibilities regarding credentials and session security'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe
                ? 'प्रयोगकर्ताहरू आफ्नो खाताको पासवर्ड गोप्य राख्न र आफ्नो खाताबाट हुने सम्पूर्ण गतिविधिहरूको लागि स्वयम् जिम्मेवार हुनेछन्। यदि तपाईंलाई आफ्नो खातामा कुनै अनाधिकृत पहुँच भएको शंका लागेमा तुरुन्त पासवर्ड परिवर्तन गर्नुहोस् वा प्रशासनलाई जानकारी गराउनुहोस्।'
                : 'Members are solely responsible for maintaining the confidentiality of their login passwords. You agree to immediately notify the club administration of any unauthorized use or security breach of your account.'}
            </p>
          </CardContent>
        </Card>

        {/* Section 5: User Uploads & Media */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                5
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '५. सामग्री तथा तस्बिर अपलोड (User Content & Media)' : '5. User Content, Gallery & Notices'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'ग्यालरी, सूचना र प्रोफाइलमा फोटो तथा सामग्री अपलोड गर्ने नियम' : 'Policies regarding photos, event media, and community contributions'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe
                ? 'क्लबका कार्यक्रम, खेलकुद प्रतियोगिता वा सामाजिक कार्यका तस्बिर तथा सामग्रीहरू सार्वजनिक गर्दा स्थानीय संस्कृति, व्यक्तिगत मर्यादा र प्रतिलिपि अधिकारको पूर्ण सम्मान गर्नुपर्छ। क्लबले कुनै पनि अनुपयुक्त वा आपत्तिजनक सामग्री बिना पूर्वसूचना हटाउने अधिकार राख्दछ।'
                : 'Any images or content uploaded to our community gallery or notices must be respectful and related to club activities. High School Youth Club reserves the right to review, edit, or remove any content that violates decency, copyright, or community guidelines.'}
            </p>
          </CardContent>
        </Card>

        {/* Section 6: Club Activities Disclaimer */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                6
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '६. कार्यक्रम सहभागिता तथा दायित्व (Activity & Liability Disclaimer)' : '6. Club Activities & Liability Disclaimer'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'खेलकुद, सरसफाइ तथा स्वयंसेवामा सहभागिता सम्बन्धी जानकारी' : 'Safety expectations during community sports, volunteering, and outdoor events'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe ? (
                <>
                  क्लबद्वारा आयोजित खेलकुद प्रतियोगिता, वृक्षारोपण, सरसफाइ अभियान तथा शारीरिक गतिविधिहरूमा सहभागी हुँदा स्वयंसेवक तथा खेलाडीहरूले आवश्यक सुरक्षा सतर्कता अपनाउनुपर्छ। क्लबले सधैं सुरक्षालाई उच्च प्राथमिकतामा राख्ने भए तापनि बाह्य शारीरिक गतिविधिमा हुने सामान्य चोटपटक वा अप्रत्याशित घटनाहरूमा सहभागीहरूले आफ्नै सुझबुझ र अभिभावकको समन्वयमा भाग लिनुपर्दछ।
                </>
              ) : (
                <>
                  While High School Youth Club takes care to organize sports tournaments, clean-up drives, and community events safely, participation in physical outdoor activities involves standard voluntary physical exertion. Participants are advised to exercise personal caution and obtain parental permission when applicable.
                </>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Section 7: Termination & Account Suspension */}
        <Card className="border border-border/80 bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                7
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '७. खाता निलम्बन वा खारेजी (Account Termination)' : '7. Termination & Account Suspension'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'नियम उल्लंघन भएको खण्डमा क्लबको अधिकार' : 'Circumstances leading to account restrictions or permanent removal'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe
                ? 'क्लबको आचारसंहिता, सुरक्षा नियम वा प्रचलित कानूनको गम्भीर उल्लंघन गर्ने प्रयोगकर्ता वा सदस्यको खाता क्लब प्रशासनले निलम्बन वा स्थायी रूपमा खारेज गर्न सक्नेछ।'
                : 'High School Youth Club reserves the right to suspend or terminate accounts that repeatedly violate these Terms, engage in fraud, or undermine community safety.'}
            </p>
          </CardContent>
        </Card>

        {/* Section 8: Governing Law & Contact */}
        <Card className="border border-border/80 bg-gradient-to-br from-card to-muted/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 flex items-center justify-center font-bold text-sm">
                8
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-heading">
                  {isNe ? '८. लागू कानून र सम्पर्क विवरण (Governing Law & Contact)' : '8. Governing Law & Contact Details'}
                </CardTitle>
                <CardDescription>
                  {isNe ? 'कानूनी क्षेत्राधिकार र नियम सम्बन्धी सोधपुछ' : 'Jurisdiction under laws of Nepal and how to reach the club'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <p>
              {isNe
                ? 'यी नियम तथा सर्तहरू नेपालको प्रचलित कानून तथा कञ्चनपुर जिल्लाको क्षेत्राधिकार अन्तर्गत सञ्चालित हुनेछन्। यी सर्तहरूबारे कुनै जिज्ञासा वा सुझाव भएमा हामीलाई सम्पर्क गर्नुहोस्:'
                : 'These Terms and Conditions are governed by and construed in accordance with the laws of Nepal. For questions, suggestions, or governance clarifications, reach out to our team:'}
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
                  <p className="font-semibold text-foreground text-sm">{isNe ? 'इमेल' : 'Email'}</p>
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
                  <p className="font-semibold text-foreground text-sm">{isNe ? 'सम्पर्क फोन' : 'Phone'}</p>
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
                <Link href="/privacy-policy">
                  <span>{isNe ? 'गोपनीयता नीति हेर्नुहोस्' : 'View Privacy Policy'}</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  <span>{isNe ? 'सम्पर्क फारम' : 'Contact Support'}</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
