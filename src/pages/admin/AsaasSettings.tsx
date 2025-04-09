
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAsaas } from '@/contexts/asaas';
import AdminLayout from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AsaasSettings } from '@/types/asaas';

// Define the form schema using Zod
const asaasSettingsSchema = z.object({
  isEnabled: z.boolean().default(false),
  apiKey: z.string().optional(),
  allowCreditCard: z.boolean().default(true),
  allowPix: z.boolean().default(true),
  manualCreditCard: z.boolean().default(false),
  sandboxMode: z.boolean().default(true),
  sandboxApiKey: z.string().optional(),
  productionApiKey: z.string().optional(),
  manualCardProcessing: z.boolean().default(false),
  manualPixPage: z.boolean().default(false),
  manualPaymentConfig: z.boolean().default(false),
  manualCardStatus: z.enum(['CONFIRMED', 'RECEIVED', 'PENDING', 'APPROVED', 'CANCELLED', 'FAILED', 'ANALYSIS', 'REJECTED']).default('ANALYSIS'),
});

// Set type for the form using the schema
type AsaasSettingsFormValues = z.infer<typeof asaasSettingsSchema>;

const AsaasSettings = () => {
  const { settings, loading, saveSettings } = useAsaas();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create and configure the form
  const form = useForm<AsaasSettingsFormValues>({
    resolver: zodResolver(asaasSettingsSchema),
    defaultValues: {
      isEnabled: false,
      apiKey: '',
      allowCreditCard: true,
      allowPix: true,
      manualCreditCard: false,
      sandboxMode: true,
      sandboxApiKey: '',
      productionApiKey: '',
      manualCardProcessing: false,
      manualPixPage: false,
      manualPaymentConfig: false,
      manualCardStatus: 'ANALYSIS',
    },
  });

  // Update form values when settings are loaded
  useEffect(() => {
    if (!loading && settings) {
      form.reset({
        isEnabled: settings.isEnabled || false,
        apiKey: settings.apiKey || '',
        allowCreditCard: settings.allowCreditCard !== undefined ? settings.allowCreditCard : true,
        allowPix: settings.allowPix !== undefined ? settings.allowPix : true,
        manualCreditCard: settings.manualCreditCard || false,
        sandboxMode: settings.sandboxMode !== undefined ? settings.sandboxMode : true,
        sandboxApiKey: settings.sandboxApiKey || '',
        productionApiKey: settings.productionApiKey || '',
        manualCardProcessing: settings.manualCardProcessing || false,
        manualPixPage: settings.manualPixPage || false,
        manualPaymentConfig: settings.manualPaymentConfig || false,
        manualCardStatus: settings.manualCardStatus || 'ANALYSIS',
      });
    }
  }, [form, loading, settings]);

  const onSubmit = async (data: AsaasSettingsFormValues) => {
    setIsSubmitting(true);

    try {
      console.log('Saving Asaas settings:', data);

      // If API key isn't provided, show an error
      if (!data.apiKey && !data.sandboxApiKey && !data.productionApiKey) {
        toast({
          title: "API Key Required",
          description: "Please provide at least one API key (sandbox or production).",
          variant: "destructive",
        });
        return;
      }

      // Save settings with required sandboxMode
      await saveSettings({
        ...data,
        // When in sandbox mode, use sandboxApiKey as the main apiKey
        apiKey: data.sandboxMode ? data.sandboxApiKey : data.productionApiKey,
        // Ensure sandboxMode is always defined as required by AsaasSettings type
        sandboxMode: data.sandboxMode,
      });

      toast({
        title: "Settings Saved",
        description: "Your Asaas integration settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Asaas Payment Settings</h1>
        <p className="text-muted-foreground">Configure your Asaas payment integration</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Configuration</CardTitle>
              <CardDescription>
                Enable or disable Asaas payment integration and configure payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="isEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Asaas Payments</FormLabel>
                      <FormDescription>
                        Turn on to activate Asaas payment processing on your checkout
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowCreditCard"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Accept Credit Cards</FormLabel>
                      <FormDescription>
                        Allow customers to pay with credit cards
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch('isEnabled')}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowPix"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Accept PIX</FormLabel>
                      <FormDescription>
                        Allow customers to pay with PIX instant payments
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch('isEnabled')}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>
                Set up your Asaas API credentials for payment processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="sandbox">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sandbox">Sandbox (Test)</TabsTrigger>
                  <TabsTrigger value="production">Production (Live)</TabsTrigger>
                </TabsList>
                <TabsContent value="sandbox" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="sandboxMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Use Sandbox Mode</FormLabel>
                          <FormDescription>
                            Use Asaas sandbox environment for testing (no real payments)
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={!form.watch('isEnabled')}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sandboxApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sandbox API Key</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your Asaas sandbox API key"
                            {...field}
                            disabled={!form.watch('isEnabled') || !form.watch('sandboxMode')}
                          />
                        </FormControl>
                        <FormDescription>
                          This key is used for test payments and won't charge customers
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="production" className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="productionApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Production API Key</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your Asaas production API key"
                            {...field}
                            disabled={!form.watch('isEnabled') || form.watch('sandboxMode')}
                          />
                        </FormControl>
                        <FormDescription>
                          This key will process real payments and charge customers
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced payment processing options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="manualCardProcessing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Manual Card Processing</FormLabel>
                      <FormDescription>
                        Simulate card payment responses instead of real processing
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch('isEnabled')}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch('manualCardProcessing') && (
                <FormField
                  control={form.control}
                  name="manualCardStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Card Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                          <SelectItem value="RECEIVED">RECEIVED</SelectItem>
                          <SelectItem value="PENDING">PENDING</SelectItem>
                          <SelectItem value="APPROVED">APPROVED</SelectItem>
                          <SelectItem value="ANALYSIS">ANALYSIS</SelectItem>
                          <SelectItem value="REJECTED">REJECTED</SelectItem>
                          <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                          <SelectItem value="FAILED">FAILED</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Status to be returned when processing card payments manually
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="manualPixPage"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Manual PIX Page</FormLabel>
                      <FormDescription>
                        Show a custom PIX payment page with proof upload
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch('isEnabled')}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manualPaymentConfig"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Manual Payment Config</FormLabel>
                      <FormDescription>
                        Allow products to override global payment settings
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch('isEnabled')}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmitting || loading}>
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </AdminLayout>
  );
};

export default AsaasSettings;
