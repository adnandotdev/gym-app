import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import Button from '../../components/Button';
import { spacing, radius, typography } from '../../theme/colors';
import { useAppTheme } from '../../context/ThemeContext';
import useThemedStyles from '../../theme/useThemedStyles';

const GOAL_OPTIONS = ['Weight Loss', 'Muscle Build'];
const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];
const GENDER_OPTIONS = ['Male', 'Female', 'Prefer not to say'];
const EQUIPMENT_OPTIONS = ['Bodyweight', 'Portable', 'Gym'];
const FOCUS_AREAS = ['Chest', 'Arms', 'Abs', 'Legs'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const INJURIES_LIST = ['No injuries', 'Shoulders', 'Back', 'Waist', 'Wrist', 'Knee'];

export default function EditProfileScreen({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useThemedStyles(createStyles);
  const { user, updateUser } = useContext(AuthContext);
  const [isSaving, setIsSaving] = useState(false);

  // Editable profile state initialized with current user context
  const [formData, setFormData] = useState({
    name: user?.name || '',
    fitnessGoal: user?.fitnessGoal || '',
    gender: user?.gender || '',
    fitnessLevel: user?.fitnessLevel || '',
    age: user?.age ? String(user.age) : '25',
    height: user?.height ? String(user.height) : '170',
    heightUnit: user?.heightUnit || 'cm',
    currentWeight: user?.currentWeight ? String(user.currentWeight) : '70',
    targetWeight: user?.targetWeight ? String(user.targetWeight) : '70',
    weightUnit: user?.weightUnit || 'kg',
    focusAreas: user?.focusAreas || [],
    trainingDays: user?.trainingDays || [],
    trainingReminder: user?.trainingReminder || false,
    equipment: user?.equipment || '',
    injuries: user?.injuries || [],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Live BMI re-computation if weight or height changes
      if (field === 'height' || field === 'currentWeight' || field === 'heightUnit' || field === 'weightUnit') {
        const heightVal = parseFloat(updated.height) || 0;
        const weightVal = parseFloat(updated.currentWeight) || 0;
        
        let weightKg = weightVal;
        let heightCm = heightVal;

        if (updated.weightUnit.toLowerCase() === 'lb') {
          weightKg = weightVal * 0.45359237;
        }
        if (updated.heightUnit.toLowerCase() === 'ft') {
          heightCm = heightVal * 30.48;
        }

        if (heightCm > 0) {
          const heightM = heightCm / 100;
          updated.bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
        }
      }
      return updated;
    });
  };

  const toggleArrayItem = (field, item) => {
    setFormData((prev) => {
      const currentArray = prev[field] || [];
      const updatedArray = currentArray.includes(item)
        ? currentArray.filter((i) => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Required Field',
        text2: 'Please enter your name.',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Cast numerical fields
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10) || 25,
        height: parseFloat(formData.height) || 170,
        currentWeight: parseFloat(formData.currentWeight) || 70,
        targetWeight: parseFloat(formData.targetWeight) || 70,
      };

      const response = await api.put('/auth/profile', payload);

      if (response.data && response.data.success) {
        // Sync context
        await updateUser(response.data.user);
        Toast.show({
          type: 'success',
          text1: 'Profile Updated',
          text2: 'Your physical profile has been updated.',
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: response.data.message || 'Error occurred.',
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Toast.show({
        type: 'error',
        text1: 'Connection Error',
        text2: error.response?.data?.message || error.message || 'Failed to sync with backend.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Back to profile"
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        
        {/* SECTION 1: ACCOUNT DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account Details</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={formData.name}
              onChangeText={(val) => handleChange('name', val)}
              placeholder="Your Name"
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address (Read Only)</Text>
            <TextInput
              style={[styles.textInput, styles.disabledInput]}
              value={user?.email}
              editable={false}
              placeholderTextColor={colors.muted}
            />
          </View>
        </View>

        {/* SECTION 2: PHYSICAL MEASUREMENTS */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Body Dimensions</Text>
          
          <View style={styles.measurementGroup}>
            {/* Age */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                style={styles.textInput}
                value={formData.age}
                onChangeText={(val) => handleChange('age', val)}
                keyboardType="numeric"
              />
            </View>
            
            {/* Gender Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.pillRow}>
                {GENDER_OPTIONS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.choicePillSmall,
                      formData.gender === g && styles.choicePillActive,
                    ]}
                    onPress={() => handleChange('gender', g)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: formData.gender === g }}
                  >
                    <Text style={[styles.pillText, formData.gender === g && styles.pillTextActive]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Height and Unit */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 2 }]}>
              <Text style={styles.inputLabel}>Height</Text>
              <TextInput
                style={styles.textInput}
                value={formData.height}
                onChangeText={(val) => handleChange('height', val)}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Unit</Text>
              <View style={styles.unitToggle}>
                {['cm', 'ft'].map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[styles.unitBtn, formData.heightUnit === unit && styles.unitBtnActive]}
                    onPress={() => handleChange('heightUnit', unit)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: formData.heightUnit === unit }}
                  >
                    <Text style={[styles.unitText, formData.heightUnit === unit && styles.unitTextActive]}>
                      {unit.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Weight and Unit */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 2 }]}>
              <Text style={styles.inputLabel}>Current Weight</Text>
              <TextInput
                style={styles.textInput}
                value={formData.currentWeight}
                onChangeText={(val) => handleChange('currentWeight', val)}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Unit</Text>
              <View style={styles.unitToggle}>
                {['kg', 'lb'].map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[styles.unitBtn, formData.weightUnit === unit && styles.unitBtnActive]}
                    onPress={() => handleChange('weightUnit', unit)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: formData.weightUnit === unit }}
                  >
                    <Text style={[styles.unitText, formData.weightUnit === unit && styles.unitTextActive]}>
                      {unit.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Target Weight */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Target Weight ({formData.weightUnit})</Text>
            <TextInput
              style={styles.textInput}
              value={formData.targetWeight}
              onChangeText={(val) => handleChange('targetWeight', val)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* SECTION 3: FITNESS GOALS */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Fitness Alignment</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Primary Goal</Text>
            <View style={styles.choiceGroup}>
              {GOAL_OPTIONS.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[styles.choiceCard, formData.fitnessGoal === goal && styles.choiceCardActive]}
                  onPress={() => handleChange('fitnessGoal', goal)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: formData.fitnessGoal === goal }}
                >
                  <Text style={[styles.choiceCardText, formData.fitnessGoal === goal && styles.choiceCardTextActive]}>
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Fitness Experience Level</Text>
            <View style={styles.choiceGroup}>
              {LEVEL_OPTIONS.map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  style={[styles.choiceCard, formData.fitnessLevel === lvl && styles.choiceCardActive]}
                  onPress={() => handleChange('fitnessLevel', lvl)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: formData.fitnessLevel === lvl }}
                >
                  <Text style={[styles.choiceCardText, formData.fitnessLevel === lvl && styles.choiceCardTextActive]}>
                    {lvl}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Preferred Equipment</Text>
            <View style={styles.choiceGroup}>
              {EQUIPMENT_OPTIONS.map((eq) => (
                <TouchableOpacity
                  key={eq}
                  style={[styles.choiceCard, formData.equipment === eq && styles.choiceCardActive]}
                  onPress={() => handleChange('equipment', eq)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: formData.equipment === eq }}
                >
                  <Text style={[styles.choiceCardText, formData.equipment === eq && styles.choiceCardTextActive]}>
                    {eq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* SECTION 4: ROUTINES & INJURIES */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Targeting & Routines</Text>

          {/* Focus Areas */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Muscle Focus Areas</Text>
            <View style={styles.checkboxGroup}>
              {FOCUS_AREAS.map((area) => {
                const isSelected = formData.focusAreas.includes(area);
                return (
                  <TouchableOpacity
                    key={area}
                    style={[styles.checkboxCard, isSelected && styles.checkboxCardActive]}
                    onPress={() => toggleArrayItem('focusAreas', area)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                  >
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={isSelected ? colors.recovery : colors.muted}
                    />
                    <Text style={[styles.checkboxLabel, isSelected && styles.checkboxLabelActive]}>
                      {area}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Training Days */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Training Days Selection</Text>
            <View style={styles.checkboxGroup}>
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = formData.trainingDays.includes(day);
                return (
                  <TouchableOpacity
                    key={day}
                    style={[styles.checkboxCard, isSelected && styles.checkboxCardActive]}
                    onPress={() => toggleArrayItem('trainingDays', day)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                  >
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={isSelected ? colors.recovery : colors.muted}
                    />
                    <Text style={[styles.checkboxLabel, isSelected && styles.checkboxLabelActive]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Training Reminder Switch */}
          <View style={styles.switchRow}>
            <View style={styles.switchCopy}>
              <Text style={styles.switchLabel}>Training Reminders</Text>
              <Text style={styles.switchSubtitle}>Get daily workout reminders</Text>
            </View>
            <Switch
              trackColor={{ false: colors.borderStrong, true: colors.recovery }}
              thumbColor={formData.trainingReminder ? colors.white : colors.muted}
              ios_backgroundColor={colors.borderStrong}
              onValueChange={(val) => handleChange('trainingReminder', val)}
              value={formData.trainingReminder}
            />
          </View>

          {/* Injuries */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Current Injuries / Constraints</Text>
            <View style={styles.checkboxGroup}>
              {INJURIES_LIST.map((injury) => {
                const isSelected = formData.injuries.includes(injury);
                return (
                  <TouchableOpacity
                    key={injury}
                    style={[styles.checkboxCard, isSelected && styles.checkboxCardActive]}
                    onPress={() => toggleArrayItem('injuries', injury)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isSelected }}
                  >
                    <Ionicons
                      name={isSelected ? 'checkbox' : 'square-outline'}
                      size={20}
                      color={isSelected ? colors.danger : colors.muted}
                    />
                    <Text style={[styles.checkboxLabel, isSelected && styles.checkboxLabelActive]}>
                      {injury}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.buttonWrapper}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={isSaving}
          />
        </View>

      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => ({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screen,
    minHeight: 56,
    backgroundColor: colors.canvas,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 44,
    height: 44,
  },
  scrollContent: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.screen,
  },
  keyboardView: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.card,
    borderCurve: 'continuous',
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  inputContainer: {
    minWidth: 0,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.mutedStrong,
    marginBottom: spacing.micro,
  },
  textInput: {
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.control,
    color: colors.textPrimary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 48,
    borderCurve: 'continuous',
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
  },
  disabledInput: {
    backgroundColor: colors.selectedSoft,
    color: colors.muted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  measurementGroup: {
    gap: spacing.md,
  },
  choicePillSmall: {
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.control,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choicePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextActive: {
    color: colors.accentOnDark,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceWarm,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
    overflow: 'hidden',
  },
  unitBtn: {
    flex: 1,
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitBtnActive: {
    backgroundColor: colors.primary,
  },
  unitText: {
    color: colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  unitTextActive: {
    color: colors.accentOnDark,
  },
  choiceGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  choiceCard: {
    flexGrow: 1,
    flexBasis: 88,
    minHeight: 44,
    backgroundColor: colors.surfaceWarm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  choiceCardText: {
    textAlign: 'center',
    flexShrink: 1,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  choiceCardTextActive: {
    color: colors.accentOnDark,
  },
  checkboxGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  checkboxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.control,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    minHeight: 44,
    gap: spacing.xs,
  },
  checkboxCardActive: {
    borderColor: colors.recovery,
    backgroundColor: colors.recoverySoft,
  },
  checkboxLabel: {
    flexShrink: 1,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  checkboxLabelActive: {
    color: colors.recovery,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceWarm,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.control,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  switchCopy: {
    flex: 1,
    minWidth: 0,
  },
  switchLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  switchSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  buttonWrapper: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
});
