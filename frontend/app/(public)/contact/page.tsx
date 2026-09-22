'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useSubmitContact, useSiteSettings } from '@/hooks/use-queries';
import { useLanguage } from '@/lib/language-context';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  phone: z.string().trim().max(25, 'Phone number cannot exceed 25 characters').optional().or(z.literal('')),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(200, 'Subject cannot exceed 200 characters'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000, 'Message cannot exceed 5000 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { t } = useLanguage();
  const { data: settings } = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const submitContactMutation = useSubmitContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContactMutation.mutateAsync({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || undefined,
        subject: data.subject.trim(),
        message: data.message.trim(),
      });
      toast.success(t('contactPage.successMessage'));
      setSubmitted(true);
      reset();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        t('contactPage.errorMessage');
      toast.error('Submission Failed', {
        description: errorMsg,
      });
    }
  };

  // Dynamic Contact Information from SiteSettings (with localization fallback)
  const officeAddress = settings?.address || t('contactPage.officeAddressVal');
  const contactPhone = settings?.contactPhone || t('contactPage.phoneVal');
  const phoneTel = `tel:${contactPhone.replace(/[^\d+]/g, '')}`;
  const contactEmail = settings?.contactEmail || t('contactPage.emailVal');
  const emailMailto = `mailto:${contactEmail}`;
  const officeHours =
    (settings?.portalConfig as Record<string, any> | undefined)?.['officeHours'] ||
    t('contactPage.hoursVal');

  // WhatsApp CTA link from settings
  const rawWhatsapp = settings?.socialLinks?.whatsapp || settings?.contactPhone || '9748886690';
  const whatsappDigits = rawWhatsapp.replace(/\D/g, '');
  const formattedWhatsapp = whatsappDigits.length === 10 ? `977${whatsappDigits}` : whatsappDigits;
  const whatsappHref = `https://wa.me/${formattedWhatsapp}`;
  const whatsappDisplay = rawWhatsapp.replace(/^\+?977\s?/, '');

  const mapDestination = 'Shree Krishna Secondary School, Krishnapur-4, Gulariya, Kanchanpur, Nepal';
  const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapDestination)}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapDestination)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        badge={t('contactPage.badge')}
        title={t('contactPage.title')}
        subtitle={t('contactPage.subtitle')}
        breadcrumbs={[{ label: t('nav.contact') }]}
        backgroundImage="/community-group.jpg"
        overlayClassName="bg-black/45 bg-gradient-to-b from-black/65 via-black/35 to-black/70"
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-border/80 bg-card p-4 xs:p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="font-heading text-2xl font-bold tracking-tight">
                  {t('contactPage.getInTouch')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('contactPage.getInTouchDesc')}
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('contactPage.officeAddressLabel')}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {officeAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('contactPage.phoneLabel')}</p>
                    <a
                      href={phoneTel}
                      className="text-muted-foreground text-xs leading-relaxed hover:text-foreground hover:underline transition-colors block"
                    >
                      {contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('contactPage.emailLabel')}</p>
                    <a
                      href={emailMailto}
                      className="text-muted-foreground text-xs leading-relaxed hover:text-foreground hover:underline transition-colors block"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t('contactPage.hoursLabel')}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {officeHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Connect */}
              <div>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-transform hover:scale-[1.02] min-h-[44px] text-center"
                >
                  <span>Chat with Club on WhatsApp ({whatsappDisplay})</span>
                </a>
              </div>

              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">{t('contactPage.directContact')}</p>
                <p>
                  {t('footer.tagline')}
                </p>
              </div>
            </Card>
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-7">
            <Card className="border border-border/80 bg-card p-4 xs:p-6 sm:p-8 shadow-sm">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="text-2xl font-bold">{t('contactPage.formTitle')}</CardTitle>
                <CardDescription>
                  {t('contactPage.formSubtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h4 className="font-heading text-xl font-bold">{t('contactPage.successMessage')}</h4>
                    <Button variant="outline" onClick={() => setSubmitted(false)}>
                      {t('contactPage.submitBtn')}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('contactPage.fullNameLabel')}</Label>
                        <Input
                          id="name"
                          placeholder={t('contactPage.fullNamePlaceholder')}
                          disabled={submitContactMutation.isPending}
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contactPage.emailLabelForm')}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('contactPage.emailPlaceholder')}
                          disabled={submitContactMutation.isPending}
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('contactPage.phoneLabelForm')}</Label>
                        <Input
                          id="phone"
                          placeholder={t('contactPage.phonePlaceholder')}
                          disabled={submitContactMutation.isPending}
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <p className="text-xs text-destructive">{errors.phone.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">{t('contactPage.subjectLabel')}</Label>
                        <Input
                          id="subject"
                          placeholder={t('contactPage.subjectPlaceholder')}
                          disabled={submitContactMutation.isPending}
                          {...register('subject')}
                        />
                        {errors.subject && (
                          <p className="text-xs text-destructive">{errors.subject.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contactPage.messageLabel')}</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder={t('contactPage.messagePlaceholder')}
                        disabled={submitContactMutation.isPending}
                        {...register('message')}
                      />
                      {errors.message && (
                        <p className="text-xs text-destructive">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-11"
                      disabled={submitContactMutation.isPending}
                    >
                      {submitContactMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('contactPage.submittingBtn')}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t('contactPage.submitBtn')}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map + FAQ Side-by-Side Section */}
        <div className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* LEFT: Find Our Office on the Map */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {t('contactPage.mapTitle')}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {t('contactPage.mapSubtitle')}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
                  <a
                    href={mapSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors"
                  >
                    <span>Open in Maps</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="text-muted-foreground/40 text-xs select-none">|</span>
                  <a
                    href={mapSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:underline transition-colors"
                  >
                    <span>{t('contactPage.viewLargerMap')}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="relative w-full h-80 sm:h-[420px] rounded-2xl overflow-hidden border border-border/80 bg-muted/30 shadow-sm">
                <iframe
                  title="Shree Krishna Secondary School Location"
                  src={mapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* RIGHT: Frequently Asked Questions */}
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {t('contactPage.faqTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {t('contactPage.faqSubtitle')}
                </p>
              </div>

              <Card className="border border-border/80 bg-card p-4 sm:p-6 shadow-sm">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-sm font-semibold text-left">
                      {t('contactPage.faq1Q')}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t('contactPage.faq1A')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-sm font-semibold text-left">
                      {t('contactPage.faq2Q')}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t('contactPage.faq2A')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-sm font-semibold text-left">
                      {t('contactPage.faq3Q')}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t('contactPage.faq3A')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger className="text-sm font-semibold text-left">
                      {t('contactPage.faq4Q')}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t('contactPage.faq4A')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger className="text-sm font-semibold text-left">
                      {t('contactPage.faq5Q')}
                    </AccordionTrigger>
                    <AccordionContent>
                      {t('contactPage.faq5A')}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
