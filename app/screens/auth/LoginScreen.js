import React, { useContext, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/Button';
import BrandLogo from '../../components/BrandLogo';
import MotionPressable from '../../components/MotionPressable';
import { radius, spacing, typography } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

export default function LoginScreen({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <MotionPressable style={styles.backButton} onPress={goBack} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={28} color={colors.ink} />
          </MotionPressable>

          <BrandLogo style={{ alignSelf: 'center' }} />
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

            <Button style={styles.submitButton} title={step === 'email' ? 'Continue' : 'Sign In'} onPress={step === 'email' ? continueWithEmail : handleLogin} loading={isSubmitting} />
          </View>

          <View style={styles.accountRow}>
            <Text style={styles.mutedText}>Don't have an account? </Text>
            <MotionPressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.accountLink}>Create Account</Text>
            </MotionPressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => ({
  container: { flex: 1, backgroundColor: colors.canvas },
  keyboard: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.screen, paddingBottom: spacing.xl },
  backButton: { width: 44, height: 44, justifyContent: 'center', marginTop: spacing.xs },
  title: { ...typography.screenTitle, textAlign: 'center', color: colors.ink, marginTop: spacing.xs },
  form: { marginTop: spacing.xl },
  label: { ...typography.caption, fontFamily: 'Overpass_500Medium', color: colors.ink, marginBottom: spacing.xs },
  inputShell: { minHeight: 52, borderRadius: radius.control, borderCurve: 'continuous', backgroundColor: colors.surfaceWarm, flexDirection: 'row', alignItems: 'center' },
  inputError: { borderWidth: 1, borderColor: colors.danger },
  input: { flex: 1, minWidth: 0, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, fontFamily: 'Overpass_400Regular', fontSize: 16, color: colors.ink },
  eyeButton: { width: 48, height: 52, alignItems: 'center', justifyContent: 'center' },
  submitButton: { marginTop: spacing.md },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.xs },
  forgot: { minHeight: 44, alignSelf: 'flex-end', justifyContent: 'center' },
  forgotText: { ...typography.caption, fontFamily: 'Overpass_500Medium', color: colors.ink },
  accountRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: spacing.lg },
  mutedText: { ...typography.caption, color: colors.muted },
  accountLink: { ...typography.caption, fontFamily: 'Overpass_600SemiBold', color: colors.ink },
});
