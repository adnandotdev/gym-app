import React, { useContext, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';
import MotionPressable from '../../components/MotionPressable';
import { colors, radius, spacing, typography } from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const passwordRef = useRef(null);
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const continueWithEmail = () => {
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setStep('password');
    requestAnimationFrame(() => passwordRef.current?.focus());
  };

  const handleLogin = async () => {
    if (!password) {
      setError('Password is required.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (!result.success) {
        setError(result.error || 'Invalid credentials. Please try again.');
        Toast.show({ type: 'error', text1: 'Login Failed', text2: result.error });
      }
    } catch (loginError) {
      setError('Unable to connect. Please try again.');
      console.error(loginError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    if (step === 'password') {
      setStep('email');
      setError('');
      return;
    }
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <MotionPressable style={styles.backButton} onPress={goBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={28} color={colors.ink} />
          </MotionPressable>

          <Text style={styles.title}>Sign In</Text>
          <View style={styles.form}>
            <Text style={styles.label}>{step === 'email' ? 'Email Address' : 'Password'}</Text>
            <View style={[styles.inputShell, error && styles.inputError]}>
              <TextInput
                ref={step === 'password' ? passwordRef : undefined}
                style={styles.input}
                placeholder={step === 'email' ? 'Enter email address' : 'Enter password'}
                placeholderTextColor={colors.muted}
                value={step === 'email' ? email : password}
                onChangeText={(value) => {
                  step === 'email' ? setEmail(value) : setPassword(value);
                  if (error) setError('');
                }}
                keyboardType={step === 'email' ? 'email-address' : 'default'}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={step === 'password' && !showPassword}
                returnKeyType={step === 'email' ? 'next' : 'done'}
                onSubmitEditing={step === 'email' ? continueWithEmail : handleLogin}
              />
              {step === 'password' && (
                <MotionPressable style={styles.eyeButton} onPress={() => setShowPassword((visible) => !visible)} accessibilityLabel="Toggle password visibility">
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.muted} />
                </MotionPressable>
              )}
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {step === 'password' && (
              <MotionPressable style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </MotionPressable>
            )}

            <Button title={step === 'email' ? 'Continue' : 'Sign In'} onPress={step === 'email' ? continueWithEmail : handleLogin} loading={isSubmitting} />
          </View>

          <View style={styles.accountRow}>
            <Text style={styles.mutedText}>Don't have an account? </Text>
            <MotionPressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.accountLink}>Create Account</Text>
            </MotionPressable>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} /><Text style={styles.or}>Or</Text><View style={styles.divider} />
          </View>
          <View style={styles.socialRow} accessibilityRole="group" accessibilityLabel="Social sign-in providers coming soon">
            {['G', '●', 'f'].map((label) => (
              <View key={label} style={styles.socialButton} accessibilityRole="button" accessibilityState={{ disabled: true }}>
                <Text style={styles.socialText}>{label}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.socialNote}>Social sign-in coming soon</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  keyboard: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.screen, paddingBottom: spacing.xl },
  backButton: { width: 44, height: 44, justifyContent: 'center', marginTop: spacing.xs },
  title: { ...typography.screenTitle, textAlign: 'center', color: colors.ink, marginTop: spacing.xs },
  form: { marginTop: 82 },
  label: { ...typography.body, fontFamily: 'Overpass_500Medium', color: colors.ink, marginBottom: spacing.md },
  inputShell: { height: 58, borderRadius: radius.card, backgroundColor: colors.surfaceWarm, flexDirection: 'row', alignItems: 'center' },
  inputError: { borderWidth: 1, borderColor: colors.danger },
  input: { flex: 1, paddingHorizontal: spacing.md, fontFamily: 'Overpass_400Regular', fontSize: 16, color: colors.ink },
  eyeButton: { width: 52, height: 58, alignItems: 'center', justifyContent: 'center' },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
  forgot: { minHeight: 44, alignSelf: 'flex-end', justifyContent: 'center' },
  forgotText: { ...typography.caption, fontFamily: 'Overpass_500Medium', color: colors.ink },
  accountRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  mutedText: { ...typography.caption, color: colors.muted },
  accountLink: { ...typography.caption, fontFamily: 'Overpass_600SemiBold', color: colors.ink },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xl },
  divider: { flex: 1, height: 1, backgroundColor: colors.hairline },
  or: { ...typography.caption, color: colors.mutedStrong },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.screen, marginTop: spacing.xl },
  socialButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#F4F4F6', alignItems: 'center', justifyContent: 'center' },
  socialText: { fontFamily: 'Overpass_700Bold', fontSize: 24, color: colors.ink },
  socialNote: { ...typography.caption, color: colors.muted, textAlign: 'center', marginTop: spacing.sm },
});
