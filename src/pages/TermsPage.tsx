import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Users, CreditCard, Shield, AlertTriangle } from "lucide-react";
import { useIntl } from 'react-intl';
import { useLanguage } from '@/i18n/LanguageProvider';

const TermsPage = () => {
  const intl = useIntl();
  const { locale } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {intl.formatMessage({ id: 'terms.backToHome' })}
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {intl.formatMessage({ id: 'terms.title' })}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {intl.formatMessage({ id: 'terms.lastUpdated' })}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            {intl.formatMessage({ id: 'terms.description' })}
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">{intl.formatMessage({ id: 'terms.acceptance.title' })}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.acceptance.item1' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.acceptance.item2' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.acceptance.item3' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.acceptance.item4' })}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className='text-xl'>{intl.formatMessage({ id: 'terms.userResponsibilities.title' })}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.userResponsibilities.item1' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.userResponsibilities.item2' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.userResponsibilities.item3' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.userResponsibilities.item4' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.userResponsibilities.item5' })}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Guide Obligations */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className='text-xl'>{intl.formatMessage({ id: 'terms.guideObligations.title' })}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.guideObligations.item1' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.guideObligations.item2' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.guideObligations.item3' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.guideObligations.item4' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.guideObligations.item5' })}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className='text-xl'>{intl.formatMessage({ id: 'terms.paymentTerms.title' })}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.paymentTerms.item1' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.paymentTerms.item2' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.paymentTerms.item3' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.paymentTerms.item4' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.paymentTerms.item5' })}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Prohibited Activities */}
        <div className="mb-12">
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <CardTitle className='text-xl text-red-900 dark:text-red-100'>
                  {intl.formatMessage({ id: 'terms.prohibitedActivities.title' })}
                </CardTitle>
              </div>
              <CardDescription>
                {intl.formatMessage({ id: 'terms.prohibitedActivities.description' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.prohibitedActivities.item1' })}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.prohibitedActivities.item2' })}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.prohibitedActivities.item3' })}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.prohibitedActivities.item4' })}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.prohibitedActivities.item5' })}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.prohibitedActivities.item6' })}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.prohibitedActivities.item7' })}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.prohibitedActivities.item8' })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liability */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>{intl.formatMessage({ id: 'terms.liability.title' })}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className='text-gray-700 dark:text-gray-300'>
                {intl.formatMessage({ id: 'terms.liability.description' })}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.liability.item1' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.liability.item2' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.liability.item3' })}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Dispute Resolution */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>{intl.formatMessage({ id: 'terms.disputeResolution.title' })}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className='text-gray-700 dark:text-gray-300'>
                {intl.formatMessage({ id: 'terms.disputeResolution.description' })}
              </p>
              <ol className="space-y-2">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400">1</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.disputeResolution.step1' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400">2</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.disputeResolution.step2' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-400">3</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'terms.disputeResolution.step3' })}
                  </span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <div className="text-center">
          <Card>
            <CardHeader>
              <CardTitle>{intl.formatMessage({ id: 'terms.contact.title' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700 dark:text-gray-300 mb-4'>
                {intl.formatMessage({ id: 'terms.contact.description' })}
              </p>
              <Link href="/">
                <Button>
                  {intl.formatMessage({ id: 'terms.contact.button' })}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
