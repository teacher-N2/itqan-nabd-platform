# Supabase — V7.2

تم ربط المنصة بمشروع Supabase فعلي.

الجداول الأساسية:
- profiles
- curriculum_units
- curriculum_lessons
- question_bank
- academic_weeks
- weekly_items
- attempts

الخدمة الخلفية: `itqan-api`

المبدأ الأمني: مفتاح Service Role لا يوجد في ملفات الواجهة. الإجابات الصحيحة تبقى في قاعدة البيانات، ولا يعيد مسار الطالبة حقول `correct_index` أو `accepted_answers` أو `criterion`.

حالة التأسيس قبل أول دخول للمعلمة:
- الوحدات: 6
- الدروس/المكوّنات: 29
- بنك الأسئلة: يُزامن بعد تفعيل حساب المعلمة
- حسابات الطالبات: تنشئها المعلمة من المنصة
