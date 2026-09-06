import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Button from '../../components/Button';
import { colors, typography } from '../../theme/colors';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  
  // Field focus state
  const [emailFocused, setEmailFocused] = useState(false);
  
  // Field validation error state
  const [emailError, setEmailError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Frontend validation
  const validateForm = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setEmailError('Please enter a valid email address.');
        isValid = false;
      } else {
        setEmailError('');
      }
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid email address.',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Mimic API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      Toast.show({
        type: 'success',
        text1: 'Reset Link Sent',
        text2: `A recovery email has been mock-sent to ${email.trim()}.`,
      });
      
      // Wait briefly for the toast to show, then go back to Login
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header section */}
          <View style={styles.header}>
            <Text style={styles.title}>MuscleMap</Text>
            <Text style={styles.subtitle}>
              Reset your password and return to your plan.
            </Text>
          </View>

          {/* Form section */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  emailFocused && styles.inputContainerFocused,
                  emailError ? styles.inputContainerError : null,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={true}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  editable={!isSubmitting}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            <Button
              title="Reset Password"
              onPress={handleSubmit}
              loading={isSubmitting}
            />
          </View>

          {/* Footer section */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              disabled={isSubmitting}
              style={styles.backLink}
            >
              <Text style={styles.linkText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.parchment,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    ...typography.screenTitle,
    color: colors.ink,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: 16,
    backgroundColor: colors.surfaceWarm,
  },
  inputContainerFocused: {
    borderColor: colors.accent,
  },
  inputContainerError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    fontFamily: 'Overpass_400Regular',
    fontSize: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: colors.textPrimary,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  backLink: {
    paddingVertical: 8,
  },
  linkText: {
    color: colors.accent,
    fontWeight: '400',
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;
