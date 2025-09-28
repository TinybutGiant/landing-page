import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  Mail,
} from "lucide-react";
import { useIntl } from 'react-intl';
import { useLanguage } from '@/i18n/LanguageProvider';

const PrivacyPage = () => {
  const intl = useIntl();
  const { locale } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className='h-4 w-4 mr-2' />
            {intl.formatMessage({ id: 'privacy.backToHome' })}
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            {intl.formatMessage({ id: 'privacy.title' })}
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            {intl.formatMessage({ id: 'privacy.lastUpdated' })}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            {intl.formatMessage({ id: 'privacy.description' })}
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {/* Information Collection */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className='text-xl'>{intl.formatMessage({ id: 'privacy.informationCollection.title' })}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationCollection.item1' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationCollection.item2' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationCollection.item3' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationCollection.item4' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationCollection.item5' })}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Use */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className='text-xl'>{intl.formatMessage({ id: 'privacy.informationUse.title' })}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationUse.item1' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationUse.item2' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationUse.item3' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationUse.item4' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationUse.item5' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationUse.item6' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationUse.item7' })}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className='text-xl'>{intl.formatMessage({ id: 'privacy.informationSharing.title' })}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationSharing.item1' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationSharing.item2' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationSharing.item3' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationSharing.item4' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.informationSharing.item5' })}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className='text-xl'>{intl.formatMessage({ id: 'privacy.dataSecurity.title' })}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.dataSecurity.item1' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.dataSecurity.item2' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.dataSecurity.item3' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.dataSecurity.item4' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.dataSecurity.item5' })}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Your Rights */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>{intl.formatMessage({ id: 'privacy.privacyRights.title' })}</CardTitle>
              <CardDescription>
                {intl.formatMessage({ id: 'privacy.privacyRights.description' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.privacyRights.item1' })}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.privacyRights.item2' })}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.privacyRights.item3' })}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.privacyRights.item4' })}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.privacyRights.item5' })}
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.privacyRights.item6' })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cookies */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>{intl.formatMessage({ id: 'privacy.cookies.title' })}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className='text-gray-700 dark:text-gray-300'>
                {intl.formatMessage({ id: 'privacy.cookies.description' })}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.cookies.item1' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.cookies.item2' })}
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.cookies.item3' })}
                  </span>
                </li>
              </ul>
              <p className='text-gray-700 dark:text-gray-300'>
                {intl.formatMessage({ id: 'privacy.cookies.management' })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact for Privacy */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>{intl.formatMessage({ id: 'privacy.contact.title' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700 dark:text-gray-300 mb-4'>
                {intl.formatMessage({ id: 'privacy.contact.description' })}
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {intl.formatMessage({ id: 'privacy.contact.email' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {intl.formatMessage({ id: 'privacy.contact.responseTime' })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Updates */}
        <div className="text-center">
          <Card>
            <CardHeader>
              <CardTitle>{intl.formatMessage({ id: 'privacy.updates.title' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700 dark:text-gray-300 mb-4'>
                {intl.formatMessage({ id: 'privacy.updates.description' })}
              </p>
              <Link href="/">
                <Button>
                  {intl.formatMessage({ id: 'privacy.updates.button' })}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
