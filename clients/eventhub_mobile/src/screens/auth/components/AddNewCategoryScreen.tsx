import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { Category } from '../../../models/Category';
import eventAPI from '../../../apis/eventApi';
import { ContainerComponent } from '../../../components';

const AddCategoryScreen = () => {
    const [category, setCategory] = useState<Category>({
        _id: '',
        title: 'Honor Film',
        color: '#F59762',
        label: 'honor',
        key: 'honor',
        iconWhite: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAO+SURBVFiFtdZZiJZlFAfw32wNOY3VJG6VtpBFQbRITF7UTGV2kSUFURIttEnRUFpRIS43rUYXJm3UTWl0ITURxGRGtmG2YEYLWEqLiDVTbqlp9nVxzqefQ99ifh54+d7vfZ/nPf9zzv/8n8OB2xEYjaY6fKtmOw7zsQ6FvHbhHVyFhoPp/Dpsxae4FWfiZEzEU9iGJeg4GM6vF5H2oBGT8Diexl0YIbKzEp9jyP46OAMz8QwewkXpCMaK6HpEdEvxFz7G6/gZW3A1hmENnqzVcRsWYjdW4BVRz+1YjhNFelckoKX4Gqfm/ua8ZuFvnIcp2IHh1Zw3iZqtxtmD3o3GW/gJv4qaT8rIi84vxLKSPYvwQQJdjxurAbgZG0WKO0Q9V+E1nIZWQbiCINw8fJR7L0hHh2McxuASkck2vCk4UtYaE+GzGWUvJuB50UrLRJ/PyfV/oh0b0JLP27EJl2c2NuR3DxPdcmi1DGzGpRlBAcfn8yasxS0Ymu8m4u4EWxSecbin5HvT8FuCWI57q2WgYF/hqCQikwVBO/BAPtuBgbwfgdl4ESMxHh9WAiAXPJqO3xf178EbGclwkaGCaMOxmCrY/jIuFu07TZDuE9H/z+HLas4JDmwSAtKBBblxsWB6qxCVF0RHfIGj0CXI+E+C689Ahohu2YnOWgA0og/f45xB747Jd2tFSocJLfgBl+XeNozK+1EZ+U6hmlWtQbD4/rwaMsLVop4TMgNLEoSM8BpBwvUiO1sFecfn81V4W7T0mmoAekV/94l01svOEkJ2kuBO0UYKonbiMULVJtfRcdHaBTfOzf8tmC74tlJoT79c1FUHZw8K1Tuh5HlBlOt8fCPa9XZRpq58XxcAvUKcPhNDSvEYLpRc34ruKVoXCs0H6Lho3UIH3ksApwgyE5rRidPtFaw9NhhAC46t0WkBPwrivotHhHCtw3cl69bjj3IfGQxgnlDBWm26GDquxZ04UrTetkqbKgEYKhTwvhr2LhLHMKEDD9fqtBIAYqyqKB5p20vu5wgVJGbGWfi9FgCN1ZfUZLOF6MAdgnA1Wb0AwBO4bX83/VcJ2u0rJuVs8KQzQ4jOYJshyrOlFgCbcQOurAEAvJq/c+3lwAJxGJXagJiU54oje0+XNIh+7hYi8n91oNKabjFbThWHzy4xwm1EX7MQjilCSsvZgDhEGnGIGMNaxRBTzorDyC8JZKGQ7Jl5XxQwV4j6FCpcX+XHbsJLeT+/yp7dymvDGDFFtxcH0GqpL5eBoyvs6Recqmj/Al/Z9t6/c+lzAAAAAElFTkSuQmCC',
        iconColor: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAATOSURBVFiFxZZtTJVlGMd/93Oe84KA5wDxtlJUcOEbhGnolAnahi3nfGNmmU3HVPrQmjWrb231obYKPzgDncM1teZZftCUyWSzZtpIUlDLKfmCKAFyQA6Hc3he+3BCz+FBExT9b8+X/31d9/9/3ff9XPcNzxhiNOcuLS3NF0IsE0IsAcYJIWqFEJsrKiraB4LkJ6n4aVWVK8OZvjk+PmldavqEGa23muQTNfvQVAUA0zSXm6YpA0vvuXxc0crKA+64xNQPxyYkl6SmjZ/sdMVKkeN32ls4dmgn3b62AcqUZTljx44dN0dsoKysLEHTtCWSJC0HinNeXjhm7oIV2GxDL6iihDhxbC9X/vodACHEhsrKyioA26OKVuw+mDsp84U3cnNmfG6a5nYhxCpgCmBvu32N6383kv58FmNix2ICmgH9KoQ0cDpkJr84E0mIzlvNl7cDVfX19X3/uwKV3x2en+B+bosnIbUoJT3D4+/xUXtkD7dbrgwZr2k68xatIStnEYb5H2lo9LQ3NXf7bn25bvWib4UQZmSOxcCWLR/lzi1c8U1K2vg5nsS0MYPHTcPg3Jnj1J08hKapKIpCKBQiFAqh6zoArxQsVbNzCvx32q5vK3tn8WcPK1IAlJSUODwezwdCiE1AhicxlflFJWRkzrAkmCaoOvj7AtQe3k3jmeMAyLLc5XA4agzD+MLr9Z57mKjFwMaNG8uB903TRNd1ZDl8mCZk5TCvcBXuhFQUPSysGmETCFAC3Xq1t/xAe2vTJ/v377/xqKJDGegEEru7uwkGgzgcDtxuN6qqoigqi1e+x8TsOQCEAl2ar+NGg7+zY+2m9cWXRiIaCRnAZafv9Zf0xInJsVy6aWPfzwE6OjoAkCRJP+ot/zMjc9pP2VlzviotXex7XFGLgbJX9VB2ugHA5DQXqR6b/vVhpUGSpF26ru/yer06eJ+k7j0IAP3Uer8kETdAGghj09GC71Xj/i8jCcGsadMn2WVbVO8whGnUnW24qkPU7zU1MzM9IT4+jkG4eLWppbsn0CPi3OV7Pl52PnzahGgGc+pAkM9vStI/p99yRiROyy1g/qyZlgounvsFuf3U3Mge6IqJY2H+ahwOV1Ss/24nZ2t35jt1DaMn6U3AJQEcuTZpV28oHNTXD3t/jW6Q8e4k5hWtsojrmsqZ00ct/Mz8Yos4QP1v1ei6BoAU6nRu2Lo1Xgb44fKUCzUnm0kZa9LRI+jX7icJISgqXot9iAnP1tXQ6++K4lwxcUzPW2CJ9ff4uHThdBTXHwyKeyunaNDis3bm6XmFjJsw1cKHgr38UVdj4WfNfQ273WnhI6sfgN2WJAmANduu5iBCDZGDahC0fhifHINdjrphwxX1abTf7bfw45JjcAwRf6OtD82IOqeojthEGUBxTwxKg3I0Jyh9cCVomes+LGccmh4Ub7lVIOhCfeCLyB4T/kYT1esIWNfqKeOZG7Bsgb3rPLa+28OeyJTs9KcVghheTRYDQgsh1MCwDSDZGdSNR2ZASZ4NybOHb2CEsG6BrxFbsNUSaLhSUJLyRt8Apj70Fjg0K/ekDJgyvYSfA6hJeaijUOkQCCCEKQEcfFu0Ao1PQzUC1RDZByRWArWAMsrCAQQ/ovPuKOs8Gv4FpjjFpl5UuA8AAAAASUVORK5CYII=',
    });

    const handleAddCategory = async () => {
        const api = '/add-category-new'; // Đảm bảo URL khớp với server
        try {
            const newCategory = await eventAPI.HandlerEvent(api, 'post', category); // Gửi dữ liệu category
            Alert.alert('Success', 'Category added successfully');
            console.log('Added category:', newCategory);
        } catch (error) {
            Alert.alert('Error', 'Failed to add category');
            console.error('API error:', error);
        }
    };

    return (
        <ContainerComponent back>

            <View>
                <TextInput
                    placeholder="Title"
                    value={category.title}
                    onChangeText={(text) => setCategory({ ...category, title: text })}
                />
                {/* Các TextInput khác cho color, label, key, iconWhite, iconColor */}
                <Button title="Add Category" onPress={handleAddCategory} />
            </View>
        </ContainerComponent>
    );
};

export default AddCategoryScreen;
